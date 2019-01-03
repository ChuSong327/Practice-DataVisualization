const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const snowFlake = require("./db/index");
const tables = require('./config/table');

const app = express();

//CORS setting 
const corsOptions = {
    origin: "http:localhost:8080",
    optionSuccessStatus: 200,
    credentials: true
};

//Use Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

//Connect to SnowFlake database
snowFlake.connect((err, conn) => {
    if(err) {
        console.log("This is the err:", err);
    } else {
        console.log("Successfully connected as id:", snowFlake.getId());
    }
});

//Routes
app.options("/singlepiedata", cors(corsOptions));
app.get("/singlepiedata", cors(corsOptions), (req,res) => {
    snowFlake.execute({
        sqlText: `select billingcountry, count(1) as count from ${tables.coreSalesAccount} group by 1 order by 2 desc limit 20`,
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
    snowFlake.execute({
        sqlText: `select distinct
                        acct.name as account_name
                    from 
                        ${tables.coreSalesAccount} as acct
                    inner join
                        ${tables.coreSalesContact} as contact
                        on contact.accountid = acct.id
                    inner join 
                        ${tables.coreSalesCase} as cases
                        on cases.accountid = acct.id
                    order by acct.name
                    limit 50000;`,
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

app.options("/account-names", cors(corsOptions));
app.get("/case/:acctName", cors(corsOptions), (req, res) => {
    const accountName = req.params.acctName;
    snowFlake.execute({
        sqlText: `select acct.name as account_name
                        ,cs.severity__c as case_severity
                        ,count(distinct cs.casenumber) as case_count
                    from 
                        ${tables.coreSalesAccount} as acct
                    inner join
                        ${tables.coreSalesCase} as cs
                        on acct.id = cs.accountid
                    where
                        acct.name like '${ accountName }'
                    group by
                        acct.name
                        ,cs.severity__c
                    order by 3 desc;`,
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

app.get("/contact/:acctName", (req, res) => {
    const accountName = req.params.acctName;
    snowFlake.execute({
        sqlText: `select 
                        acct.name as account_name
                        ,cntct.type__c as contact_type
                        ,count(distinct cntct.id) as contact_count
                    from 
                        ${tables.coreSalesAccount} as acct
                    inner join
                        ${tables.coreSalesContact} as cntct
                        on acct.id = cntct.accountid
                    where
                        acct.name = '${ accountName }'
                    group by
                        acct.name
                        ,cntct.type__c
                    order by 1 asc;`,
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


//Handle Errors
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
