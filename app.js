/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//file upload
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/profile_images');
    },
    filename: function(req, file, callback) {
        sess = req.session;
        if (sess.name) {
            callback(null, file.fieldname + '-' + sess.name + '.png');
        }
    }
});
var upload = multer({ storage: storage }).single('userPhoto');

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});


app.use(session({ secret: 'superiorprogrammersonzxce' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//test
var sess;
var connection;

app.post('/api/photo', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end(err);
        }

        console.log("----------------" + req.body.title);

        res.redirect("../index.html");
    });
});

app.post('/uploadProject', function(req, res) {
    sess = req.session;

    var x = sess.name;
    x += Date.now();

    upload(req, res,
        function(err) {
            if (err) {
                return res.end(err);
            } else {
                var statement = "insert into projects values (null, '" + sess.name + "' , '" + req.body.title + "' , '" + req.body.details + "' , '" + x + "' )";

                if (connection) {
                    connection.query(statement, function(err) {

                        if (err) {
                            console.log(err);
                            res.send("unexpected error");

                        } else {
                            res.send("success");

                        }

                    });

                } else {
                    res.send("Please try later. Connectivity problem");
                }



                res.end("success");
            }

            connection.end(function(err) {
                console.log("error ending connection: " + err);
            });

        });
});


app.get('/abc', function(req, res) {

    sess = req.session;

    if (sess.name) {
        res.write(sess.name);
        res.end();

    } else {
        sess.name = "waqas";
        res.write("Created");
    }
    res.end();


});

app.get('/status', function(req, res) {

    sess = req.session;
    var logged;
    var edit;
    var profileexists = "false";
    var following = "false";
    if (sess.name) {
        logged = sess.name;
    } else {
        logged = 'false';
    }

    var x = req.headers.referer;
    x = x.split("?");
    x = x[1];

    console.log(x + "+++++++++++++++++++++++++++++++++++++++" + sess.name)
    if (x == sess.name) {
        edit = 'true';
    } else {
        edit = 'false';
    }

    dbconnect();

    stat = true;
    console.log(req.body);

    var statement = "select password from user where email = '" + x + "';";

    if (connection) {
        connection.query(statement, function(err, rows) {

            if (err) {
                console.log(err);
                res.send("unexpected error");

                stat = false;
            } else {
                console.log(rows.length);

                if (rows.length > 0) {
                    profileexists = "true";

                    console.log(profileexists + "((((((((((((((((((((((((((((((((((((((((((((((((((((");

                } else {
                    res.send("unsuccess");

                    stat = false;
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");

        stat = false;
    }

    if (sess.name) {
        var statement = "select * from followers where email1 = '" + sess.name + "' and email2 = '" + x + "';";

        if (connection) {
            connection.query(statement, function(err, rows) {

                if (err) {
                    console.log(err);
                    res.send("unexpected error");

                    stat = false;
                } else {
                    console.log(rows.length);

                    if (rows.length > 0) {
                        profileexists = "true";

                        if (stat) {

                            following = "true";
                            jsondata = { "logged": logged, "edit": edit, "valid": profileexists, "following": following };
                            res.send(jsondata);
                        }
                    } else {
                        jsondata = { "logged": logged, "edit": edit, "valid": profileexists, "following": following };
                        res.send(jsondata);
                        stat = false;
                    }
                }

            });

        } else {
            res.send("Please try later. Connectivity problem");

            stat = false;
        }
    } else {
        jsondata = { "logged": logged, "edit": edit, "valid": profileexists };
        res.send(jsondata);
    }



    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });



});

app.post('/resetIntro', function(req, res) {

    sess = req.session;
    dbconnect();
    if (sess.name) {

        console.log(req.body.intro);
        console.log(sess.name);

        var statement = "update user set intro = '" + req.body.intro + "' where email = '" + sess.name + "';";

        if (connection) {
            connection.query(statement, function(err) {

                if (err) {
                    console.log("error update:---------- " + err);

                    console.log("error update:---------- " + err.errno);
                    res.send("unsuccess");
                } else {
                    res.send("success");

                    console.log("intro inserted");
                }

            });

        } else {
            res.send("unsuccess");
        }

    } else {
        res.send("unsuccess");

    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });


});

app.post('/editexp', function(req, res) {

    sess = req.session;
    dbconnect();
    if (sess.name) {

        console.log(req.body);
        console.log(sess.name);

        var statement = "update experience set position = '" + req.body.position + "', company = '" + req.body.company + "', start_date = '" + req.body.start_date + "', end_date = '" + req.body.end_date + "', comments = '" + req.body.comments + "' where email = '" + sess.name + "' and ID = '" + req.body.ID + "';";

        if (connection) {
            connection.query(statement, function(err) {

                if (err) {
                    console.log("error update:---------- " + err);

                    console.log("error update:---------- " + err.errno);
                    res.send("unsuccess");
                } else {
                    res.send("success");

                    console.log("update experience");
                }

            });

        } else {
            res.send("unsuccess");
        }

    } else {
        res.send("unsuccess");

    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });


});

app.post('/editski', function(req, res) {

    sess = req.session;
    dbconnect();
    if (sess.name) {

        console.log(req.body);
        console.log(sess.name);

        var statement = "update skills set skill = '" + req.body.skill + "', level = '" + req.body.level + "' where email = '" + sess.name + "' and ID = '" + req.body.ID + "';";

        if (connection) {
            connection.query(statement, function(err) {

                if (err) {
                    console.log("error update:---------- " + err);

                    console.log("error update:---------- " + err.errno);
                    res.send("unsuccess");
                } else {
                    res.send("success");

                    console.log("updated skills");
                }

            });

        } else {
            res.send("unsuccess");
        }

    } else {
        res.send("unsuccess");

    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });


});


app.post('/editedu', function(req, res) {

    sess = req.session;
    dbconnect();
    if (sess.name) {

        console.log(req.body);
        console.log(sess.name);

        var statement = "update education set country = '" + req.body.country + "', degree = '" + req.body.degree + "', start_date = '" + req.body.start_date + "', end_date = '" + req.body.end_date + "' where email = '" + sess.name + "' and ID = '" + req.body.ID + "';";

        if (connection) {
            connection.query(statement, function(err) {

                if (err) {
                    console.log("error update:---------- " + err);

                    console.log("error update:---------- " + err.errno);
                    res.send("unsuccess");
                } else {
                    res.send("success");

                    console.log("update experience");
                }

            });

        } else {
            res.send("unsuccess");
        }

    } else {
        res.send("unsuccess");

    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });


});




app.get('/experience', function(req, res) {

    dbconnect();
    console.log("________--------------------------------------------------------------------------------------------------------");
    console.log(req.headers.referer);

    var x = req.headers.referer;
    x = x.split("?");
    x = x[1];

    console.log("This email: " + x);

    var jsondata;
    if (connection) {
        statement = "select * from experience where email = '" + x + "'";
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                res.send("error");
            } else {
                jsondata = JSON.stringify(rows);
                console.log(JSON.stringify(rows));


                if (jsondata) {
                    res.send(jsondata);
                } else { res.send("error"); }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});

app.get('/skills', function(req, res) {

    var x = req.headers.referer;
    x = x.split("?");
    x = x[1];

    dbconnect();

    console.log(req.body);

    var jsondata;
    if (connection) {
        statement = "select * from skills where email = '" + x + "'";
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                res.send("error");
            } else {
                jsondata = JSON.stringify(rows);
                console.log(JSON.stringify(rows));


                if (jsondata) {
                    res.send(jsondata);
                } else { res.send("error"); }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});

app.get('/education', function(req, res) {

    var x = req.headers.referer;
    x = x.split("?");
    x = x[1];



    dbconnect();

    console.log(req.body);

    var jsondata;
    if (connection) {
        statement = "select * from education where email = '" + x + "'";
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                res.send("error");
            } else {
                jsondata = JSON.stringify(rows);
                console.log(JSON.stringify(rows));


                if (jsondata) {
                    res.send(jsondata);
                } else { res.send("error"); }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});


app.post('/removeexp', function(req, res) {

    dbconnect();

    console.log(req.body);

    if (connection) {
        statement = "delete from experience where email = '" + sess.name + "' and id = '" + req.body.id + "'";;
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                res.send("success");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});

app.post('/removeski', function(req, res) {

    dbconnect();

    console.log(req.body);

    if (connection) {
        statement = "delete from skills where email = '" + sess.name + "' and id = '" + req.body.id + "'";;
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                res.send("success");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});


app.post('/removeedu', function(req, res) {

    dbconnect();

    console.log(req.body);

    if (connection) {
        statement = "delete from education where email = '" + sess.name + "' and id = '" + req.body.id + "'";;
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                res.send("success");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});


app.get('/profile_data', function(req, res) {
    dbconnect();

    var x = req.headers.referer;
    x = x.split("?");
    x = x[1];


    var jsondata;

    sess = req.session;



    var statement = "select * from user where email = '" + x + "'";

    if (connection) {
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                res.send("error");
            } else {
                if (rows.length > 0) {
                    jsondata = { "first_name": rows[0].first_name, "last_name": rows[0].last_name, "email": rows[0].email, "gender": rows[0].gender, "selected_country": rows[0].selected_country, "dob": rows[0].dob, "intro": rows[0].intro, "thumbup": rows[0].thumbup, "followers": rows[0].followers, "downloads": rows[0].downloads, "image": "male.png" };
                    console.log(jsondata);
                    res.send(jsondata);
                } else {
                    res.end();
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });
});

app.get('/profile_data2', function(req, res) {
    dbconnect();
    var jsondata;

    sess = req.session;

    var statement = "select * from user where email = '" + sess.name + "'";

    if (connection) {
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                res.send("error");
            } else {
                if (rows.length > 0) {
                    jsondata = { "first_name": rows[0].first_name, "last_name": rows[0].last_name, "email": rows[0].email, "gender": rows[0].gender, "selected_country": rows[0].selected_country, "dob": rows[0].dob, "intro": rows[0].intro, "thumbup": rows[0].thumbup, "followers": rows[0].followers, "downloads": rows[0].downloads, "image": "male.png" };
                    console.log(jsondata);
                    res.send(jsondata);
                } else {
                    res.end();
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });
});


app.post('/allusers', function(req, res) {
    dbconnect();

    var jsondata;

    sess = req.session;

    var statement = "select first_name, last_name, email, gender, selected_country from user where email <> '" + sess.name + "' and email not in (select email2 from followers where email1 = '" + sess.name + "')";

    if (connection) {
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                console.log("llllllllllllllll" + err);
                res.send("error");
            } else {

                console.log("ppppppppppppppppp" + err);
                if (rows.length > 0) {


                    jsondata = JSON.stringify(rows);
                    console.log(jsondata);
                    res.send(jsondata);
                } else {
                    res.end();
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });
});

app.get('/followers', function(req, res) {
    dbconnect();

    var jsondata;

    sess = req.session;

    var statement = "select first_name, last_name, email from user where email <> '" + sess.name + "' and email in (select email1 from followers where email2 = '" + sess.name + "')";

    if (connection) {
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                console.log("llllllllllllllll" + err);
                res.send("error");
            } else {

                console.log("ppppppppppppppppp" + err);
                if (rows.length > 0) {


                    jsondata = JSON.stringify(rows);
                    console.log(jsondata);
                    res.send(jsondata);
                } else {
                    res.end();
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });
});


app.get('/following', function(req, res) {
    dbconnect();

    var jsondata;

    sess = req.session;

    var statement = "select first_name, last_name, email from user where email <> '" + sess.name + "' and email in (select email2 from followers where email1 = '" + sess.name + "')";

    if (connection) {
        connection.query(statement, function(err, rows) {
            console.log(rows);
            if (err) {
                console.log("llllllllllllllll" + err);
                res.send("error");
            } else {

                console.log("ppppppppppppppppp" + err);
                if (rows.length > 0) {


                    jsondata = JSON.stringify(rows);
                    console.log(jsondata);
                    res.send(jsondata);
                } else {
                    res.end();
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });
});

app.post('/register', function(req, res) {

    dbconnect();

    console.log(req.body);

    var gender;

    var statement = "insert into user values('" + req.body.first_name + "','" + req.body.last_name + "','" + req.body.email + "','" + req.body.password + "','" + req.body.gender + "','" + req.body.selected_country + "','" + req.body.bday + "', 'Tell others about yourself.', 0, 0, 0 )";

    if (connection) {
        connection.query(statement, function(err) {

            if (err) {
                if (err.errno == 1062) {
                    res.send("duplicateemail");
                } else {
                    res.send("unexpected");
                }
            } else {
                res.send("registered");

                console.log("data inserted");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});

app.post('/addnewexp', function(req, res) {

    dbconnect();

    console.log(req.body);
    console.log(req.body.ID);

    var statement = "insert into experience values(null,'" + sess.name + "','" + req.body.position + "','" + req.body.company + "','" + req.body.start_date + "','" + req.body.end_date + "','" + req.body.comments + "')";

    if (connection) {
        connection.query(statement, function(err) {

            if (err) {
                console.log(err);
                res.send("unsuccess");

            } else {
                res.send("success");

                console.log("data inserted");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});

app.post('/addnewski', function(req, res) {

    dbconnect();

    console.log(req.body);
    console.log(req.body.ID);

    var statement = "insert into skills values(null,'" + sess.name + "','" + req.body.skill + "','" + req.body.level + "')";

    if (connection) {
        connection.query(statement, function(err) {

            if (err) {
                console.log(err);
                res.send("unsuccess");

            } else {
                res.send("success");

                console.log("data inserted");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});


app.post('/addnewedu', function(req, res) {

    dbconnect();

    console.log(req.body);
    console.log(req.body.ID);

    var statement = "insert into education values(null,'" + sess.name + "','" + req.body.country + "','" + req.body.degree + "','" + req.body.start_date + "','" + req.body.end_date + "')";

    if (connection) {
        connection.query(statement, function(err) {

            if (err) {
                console.log(err);
                res.send("unsuccess");

            } else {
                res.send("success");

                console.log("data inserted");
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});


app.post('/login', function(req, res) {
    sess = req.session;
    dbconnect();

    console.log(req.body);

    var statement = "select password from user where email = '" + req.body.loginemail + "';";

    if (connection) {
        connection.query(statement, function(err, rows) {

            if (err) {
                console.log('________________________________' +err + '________________________________');
                res.send("unexpected error");
            } else {
                console.log(rows.length);

                if (rows.length > 0) {
                    if (rows[0].password == req.body.loginpass) {
                        sess.logged = "true";
                        sess.name = req.body.loginemail;
                        res.send("success");
                    } else {
                        res.send("unsuccess");
                    }
                } else {
                    res.send("unsuccess");
                }
            }

        });

    } else {
        res.send("Please try later. Connectivity problem");
    }


    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});

app.post('/follow', function(req, res) {
    sess = req.session;
    dbconnect();

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + req.body);

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + req.body.email);


    if (req.body.email) {
        var statement = "insert into followers values(null, '" + sess.name + "','" + req.body.email + "')";

        if (connection) {
            connection.query(statement, function(err) {

                if (err) {
                    console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{" + err);
                    res.send("unexpected error");
                } else {
                    res.send("success");
                }

            });

        } else {
            res.send("Please try later. Connectivity problem");
        }
    } else { res.send("error"); }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

});


app.get('/logout', function(req, res) {
    sess = req.session;
    sess.destroy();

    res.redirect("index.html");
});

app.get('/init_database', function(req, res) {

    dbconnect();

    if (connection) {




        connection.query('drop table if exists details', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("details table dropped");
            }
        });

        connection.query('drop table if exists projects', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("projects table dropped");
            }
        });

        connection.query('drop table if exists followers', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("followers table dropped");
            }
        });

        connection.query('drop table if exists skills', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("details table dropped");
            }
        });

        connection.query('drop table if exists experience', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("experience table dropped");
            }
        });

        connection.query('drop table if exists education', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("education table dropped");
            }
        });


        connection.query('drop table if exists user', function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("user table dropped");
            }
        });




        var statement = "create table user(first_name varchar(30),last_name varchar(30),email varchar(30) primary key not null,password varchar(30), gender varchar(30), selected_country varchar(30),dob  varchar(30), intro varchar(1000), thumbup int, followers int, downloads int)";
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("user table created");

            }
        });

        var statement = "create table experience(ID int NOT NULL AUTO_INCREMENT primary key, email varchar(30), position varchar(30), company varchar(30), start_date varchar(30), end_date varchar(30), comments varchar(300),constraint foreign key(email) references user(email) )";
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("user table created");

            }
        });

        var statement = "create table education(ID int NOT NULL AUTO_INCREMENT primary key, email varchar(30), country varchar(30), degree varchar(30), start_date varchar(30), end_date varchar(30), constraint foreign key(email) references user(email) )";
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("user table created");

            }
        });

        var statement = "create table skills(ID int NOT NULL AUTO_INCREMENT primary key, email varchar(30), skill varchar(30), level varchar(30), constraint foreign key(email) references user(email) )";
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("user table created");

            }
        });

        var statement = "create table followers(ID int NOT NULL AUTO_INCREMENT primary key, email1 varchar(30), email2 varchar(30), constraint foreign key(email1) references user(email),constraint foreign key(email2) references user(email) )";
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("followers table created");

            }
        });

        var statement = "create table projects(ID int NOT NULL AUTO_INCREMENT primary key, email varchar(30), title varchar(30), details varchar(10000), projecturl varchar(50), constraint foreign key(email) references user(email))";
        connection.query(statement, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("followers table created");

            }
        });


    }

    connection.end(function(err) {
        console.log("error ending connection: " + err);
    });

    res.send("GOod Luck");
});

app.get('/checklogin', function(req, res) {
    sess = req.session;

    if (sess.logged) {
        if (sess.logged == "true") {
            if (sess.name) {

                console.log(sess.name);
                res.send("/profile.html?" + sess.name);
            } else {
                res.end();
            }
        } else {
            res.end();
        }
    } else {
        res.end();
    }

});

function dbconnect() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'seecs@123',
        database: 'programmer_book'
    });
    connection.connect(function(err) {
        if (!err) {
            console.log("Database is connected ... nn");
        } else {
            console.log("Error connecting database ... nn" + err);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            console.log("personalised: " + err) // server variable configures this)
        }
    });

    function handleDisconnect() {

        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'seecs@123',
            database: 'programmer_book',
        });
        connection.connect(function(err) {
            if (!err) {
                console.log("Database is connected ... nn");
            } else {
                console.log("Error connecting database ... nn" + err);
            }
        });
    }

}
