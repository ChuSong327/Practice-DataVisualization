const express = require("express");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const snowFlake = require("./db/index");

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req,res) => {
    snowFlake.connect((err, conn) => {
        if(err) {
            console.log("This is the err:", err);
        } else {
            console.log("Successfully connected as id:", snowFlake.getId());
        }
    });
    snowFlake.execute({
        sqlText: "select billingcountry, count(1) from core_sales_state.vw_sf_account_latest group by 1 order by 2 desc limit 20",
        complete: (err, stmt, rows) => {
            if(err) {
                console.log("This is the error message:", err.message);
            } else {
                console.log("Successfully executed statement:", stmt.getSqlText());
                res.json(rows);
            }
        }
    })
});

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
