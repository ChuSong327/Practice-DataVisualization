const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const snowFlake = require("./db/index");
const coreSalesTable = require('./config/table');

const app = express();
const corsOptions = {
    origin: "http:localhost:8080",
    optionSuccessStatus: 200
};

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());


app.options("/singlepiedata", cors(corsOptions));
app.get("/singlepiedata", cors(corsOptions), (req,res) => {
    snowFlake.connect((err, conn) => {
        if(err) {
            console.log("This is the err:", err);
        } else {
            console.log("Successfully connected as id:", snowFlake.getId());
        }
    });
    snowFlake.execute({
        sqlText: `select billingcountry, count(1) as count from ${coreSalesTable} group by 1 order by 2 desc limit 20`,
        complete: (err, stmt, rows) => {
            if(err) {
                console.log("This is the error message:", err.message);
            } else {
                console.log("Successfully executed statement:", stmt.getSqlText());
                res.set({
                    "Access-Control-Allow-Origin": "https://localhost:8080",
                    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE "
                });
                res.json(rows);
            }
        }
    })
});

app.options("/account-names", cors(corsOptions));
app.get("/account-names", cors(corsOptions), (req, res) => {
    snowFlake.connect((err, conn) => {
        if(err) {
            console.log("This is the err:", err);
        } else {
            console.log("Successfully connected as id:", snowFlake.getId());
        }
    });
    snowFlake.execute({
        sqlText: `select distinct acct.name as account_name from ${coreSalesTable} as acct limit 100`,
        complete: (err, stmt, rows) => {
            if(err) {
                console.log("This is the error message:", err.message);
            } else {
                console.log("Successfully executed statement:", stmt.getSqlText());
                res.set({
                    "Access-Control-Allow-Origin": "https://localhost:8080",
                    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE "
                });
                res.json(rows);
            }
        }
    })
})

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.render("error");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("App is listening on port:", port);
});
