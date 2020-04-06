import { webpackConfig } from "../../webpack.config";
import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { ROOT } from "../../shared/config";
import nodeExternals from "webpack-node-externals";


const config = {
    ...webpackConfig,
    entry: {
        server: path.join(__dirname, "index.ts"),
    },
    output: {
        path: path.join(ROOT, "dist"),
    },
    target: "node",
    externals: [ nodeExternals() ],
    plugins: [
        new CleanWebpackPlugin(),
    ],
};

export default config;
