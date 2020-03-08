import { Configuration } from "webpack";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";

let mode: Configuration["mode"];

switch (process.env.NODE_ENV) {
    case "development":
    case "production":
        mode = process.env.NODE_ENV;
        break;
    case "none":
    default:
        mode = "development";
        break;
}

export const webpackConfig: Configuration = {
    mode,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.scss$/,
                loader: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [ ".js", ".ts", ".jsx", ".tsx" ],
        plugins: [
            new TsConfigPathsPlugin(),
        ],
    },
};

if (mode === "development") {
    webpackConfig.devtool = "source-map";
}
