const mysql = require('mysql2');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kjarosz02',
    port: '3306',
});

app.get('/news', (req, res) => {

    const sqlread = `SELECT web_dev_news_types.topic_name, web_dev_news.id, web_dev_news.headline, web_dev_news.publish_d 
                    FROM web_dev_news 
                    INNER JOIN 
                    web_dev_news_types
                    ON 
                    web_dev_news.topic_id = web_dev_news_types.id
                    ORDER BY 
                    publish_d DESC LIMIT 9;`;

    db.query(sqlread, (err, results) => {

        if (err) throw err;
        let sqlread2 = `SELECT *  FROM web_dev_burgers`;

        db.query(sqlread2, (err, results2) => {

            if (err) throw err;

            res.render("news", { news_data: results, burgers: results2 });
            console.log(results2);
        });

    });

});

app.get("/addnews", (req, res) => {

    res.render("insert");

});

app.post("/additem", (req, res) => {

    let headl = req.body.title_data;
    let topic = req.body.topic_id;
    let date = req.body.date_pub;
    let para = req.body.long_para;

    const sqlinsert = `INSERT INTO web_dev_news (headline, topic_id, article_d, publish_d ) 
    VALUES('${headl}', '${topic}', '${para}', '${date}' );`;

    db.query(sqlinsert, (err, results) => {

        if (err) throw err;
        console.log(results);
        res.send(`News item with id ${results.insertId} added`);

    });



});

app.listen(3000, () => {
    console.log(`Web app running on localhost:3000`);
});