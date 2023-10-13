import { ConnectOptions, connect } from "mongoose";

export const dbConnect = () => {
  connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions).then(
    () => {
      console.log("connect successfully");
    },
    (err) => {
      console.log(err);
    }
  );
};
