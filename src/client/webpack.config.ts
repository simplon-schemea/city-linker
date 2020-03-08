import { webpackConfig } from "../../webpack.config";
import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { FuseDataWebpackPlugin } from "../../webpack/fuse-data";
import { ROOT } from "../../shared/config";

const config = {
    ...webpackConfig,
    entry: path.join(__dirname, "main.ts"),
    output: {
      path: path.join(ROOT, "dist/www")
    },
    target: "web",
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ title: "City Linker" }),
        new CopyWebpackPlugin([ {
            from: path.join(ROOT, "assets"),
            to: "assets",
        } ]),
        new FuseDataWebpackPlugin(),
    ]
};

export default config;
