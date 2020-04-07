interface Options {
    mimetype: "text/json"
    filename: string
}

export function triggerDownload(data: string, options: Options) {
    const blob = new Blob([ data ], { type: options.mimetype });

    const anchor = document.createElement("a");

    anchor.href = URL.createObjectURL(blob);
    anchor.download = options.filename;

    anchor.click();
}
