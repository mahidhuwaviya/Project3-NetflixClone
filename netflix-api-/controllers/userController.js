import UserModel from "../models/userModel.js";

async function handleAddUserLikedMovie(req, res) {
  try {
    const { email, data } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const { LikedMovies } = user;
      const movieAlreadyLiked = LikedMovies.find(({ id }) => id === data.id);

      if (!movieAlreadyLiked) {
        await UserModel.findByIdAndUpdate(
          user._id,
          {
            LikedMovies: [...user.LikedMovies, data],
          },
          { new: true }
        );
      } else return res.json({ msg: "Movie already added to liked list" });
    } else await UserModel.create({ email, LikedMovies: [data] });

    return res.json({ msg: "Movie Added Successfully" });
  } catch (error) {
    console.log("Error from Backend", error);
    return res.json({ msg: "ERROR ADDING MOVIE" });
  }
}

async function handleGetUserLikedMovie(req, res) {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      return res.json({
        msg: "Success Fetching Movies",
        movies: user.LikedMovies,
      });
    } else return res.json({ msg: "Email not found" });
  } catch (error) {
    console.log("Error from Backend", error);
    return res.json({ msg: "ERROR FETCHING MOVIE" });
  }
}

async function handleRemoveUserLikedMovie(req, res) {
  console.log(" handleRemoveUserLikedMovie started");
  try {
    const { email, movie_id } = req.body;
    console.log(req.body);
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const { LikedMovies } = user;
      const MovieIndex = LikedMovies.findIndex(({ id }) => id === movie_id);
      if (MovieIndex === -1) res.status(400).send({ msg: "Movie Not found" });
      LikedMovies.splice(MovieIndex, 1);
      await UserModel.findByIdAndUpdate(
        user._id,
        {
          LikedMovies,
        },
        { new: true }
      );
      return res.json({
        msg: "Movie Removed Successfully",
        movies: LikedMovies,
      });
    }
  } catch (error) {
    console.log("Error from Backend", error);
    return res.json({ msg: "ERROR Removing MOVIE" });
  }
}

export {
  handleAddUserLikedMovie,
  handleGetUserLikedMovie,
  handleRemoveUserLikedMovie,
};
