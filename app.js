import path from "path";
import fs from "fs";
import pathAbsolute from "path-absolute";

const input = pathAbsolute("./in");
const output = pathAbsolute("./out");
const file = "tiers.bin";

fs.writeFileSync(
    path.join(input, [file, "json"].join(".")),
    Buffer.from(fs.readFileSync(
        path.join(input, file),
        { encoding: "utf-8" },
    ), "base64").toString("utf-8"),
);

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(
    path.join(output, [file, "json"].join(".")),
    (() => {
        const data = JSON.parse(fs.readFileSync(
            path.join(input, [file, "json"].join(".")),
            { encoding: "utf-8" },
        ));
        if (!data.gpu) new Error(data);
        for (const key in data.gpu) {
            if (data.gpu[key].tier || data.gpu[key].tier === 0)
                data.gpu[key].tier = 5;
        }
        return JSON.stringify(data, null, 2);
    })(),
    "utf-8",
);

fs.writeFileSync(
    path.join(output, file),
    Buffer.from(
        fs.readFileSync(
            path.join(output, [file, "json"].join(".")),
            { encoding: "utf-8" },
        ),
        "utf-8",
    ).toString("base64"),
    "utf-8",
)