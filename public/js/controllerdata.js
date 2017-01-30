var app = angular.module('profiledata', []);
app.controller('profiledata_controller', function($scope, $http, $rootScope) {
    $scope.Name = "Waqas Javed";
    $rootScope.Country_name = ['Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia (Plurinational State of)', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo (Democratic Republic of the)', 'Cook Islands', 'Costa Rica', 'Cote d’Ivoire', 'Croatia', 'Cuba', 'Curacao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (Democratic People’s Republic of)', 'Korea (Republic of)', 'Kuwait', 'Kyrgyzstan', 'Lao People’s Democratic Republic', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia (the former Yugoslav Republic of)', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia (Federated States of)', 'Moldova (Republic of)', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine, State of', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthelemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China[a]', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom of Great Britain and Northern Ireland', 'United States of America', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela (Bolivarian Republic of)', 'Viet Nam', 'Virgin Islands (British)', 'Virgin Islands (U.S.)', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

    $rootScope.experienced = "null";
    $scope.profile = "null";
    $scope.profile.experience = "null";

    $scope.profile.education = "null";

    $scope.profile.skills = "null";




    $http.get('/profile_data').
    success(function(data, status, headers, config) {
        $scope.profile = data;

        $scope.profile.image = "/uploads/profile_images/userPhoto-" + data.email + ".png";


        $.ajax({
            url: "/uploads/profile_images/userPhoto-" + data.email + ".png",
            type: "HEAD",
            error: function() {

                if (data.gender == "male") {
                    $scope.profile.image = "/uploads/profile_images/male.png";
                } else {
                    $scope.profile.image = "/uploads/profile_images/female.png";
                }

                $scope.$apply();

            }
        });

    }).
    error(function(data, status, headers, config) {

    });

    $http.get('/followers').
    success(function(data, status, headers, config) {
        $scope.followers = data;

    }).
    error(function(data, status, headers, config) {

    });

    $http.get('/following').
    success(function(data, status, headers, config) {
        $scope.followings = data;
        
    }).
    error(function(data, status, headers, config) {

    });

    $http.get('/status').
    success(function(data, status, headers, config) {
        if (data.edit == "false") {
            $(".edit-btn").hide();
        }

        if (data.logged != "false" && data.following == "true") {

            $("#follow-btn").html("Following");
            $('#follow-btn').attr('disabled', true);

        }

        if (data.logged == "false") {
            $("#follow-btn").hide();
            $('.edit-btn').hide();

        } else if (data.edit == "true") {
            $("#follow-btn").hide();
        }

        // if(data.profileexists == "false"){
        //  alert("Profile not exists. Press ok to redirect");
        //  if(data.logged == "false"){
        //      location = "index.html";
        //  }else{
        //      location = "profile.html" + data.logged;
        //  }
        // }

        $scope.$apply();
    }).
    error(function(data, status, headers, config) {

    });

    $http.get('/experience').
    success(function(data, status, headers, config) {
        if (data.length > 0) {
            $scope.profile.experience = data;
            $rootScope.experienced = data;
            
        } else {

            $scope.profile.experience = [{ "position": "Add up your experiences here", "company": "", "start_date": "", "end_date": "", "comments": "", "id": "" }];
        }

    }).
    error(function(data, status, headers, config) {

    });

    $scope.editexp = function(x, y) {

        $("#exp" + x).replaceWith('<form id = "edit-expx' + x + '" name = "edit-expx' + x + '" onsubmit = " return savesnewexperience()"><br><hr><input class= "w3-input" placeholder = "Position in company" name = "position" value = "' + $rootScope.experienced[y].position + '" required></input><input  class= "w3-input"  placeholder = "Company Name" name = "company" value = "' + $rootScope.experienced[y].company + '" required></input><input  class= "w3-input" placeholder = "Start Date" name = "start_date" value = "' + $rootScope.experienced[y].start_date + '" required></input><input  class= "w3-input" placeholder = "End Date" name = "end_date"  value = "' + $rootScope.experienced[y].end_date + '" required></input><input  class= "w3-input" placeholder = "comments" name = "comments" value = "' + $rootScope.experienced[y].comments + '" required></input><button type = "button" class = "w3-btn w3-teal w3-right w3-margin-bottom save-exp" id = "save-new-exp" onclick = "editexperience(' + x + ')">Save</button></form>');

    }

    $scope.removeExp = function(x) {
        if (confirm('Are you sure you want to delete this experience from your profile?')) {
            var data = "id=" + x;
            $.post({
                url: '/removeexp',
                data,
                success: function(result) {
                    if (result == "success") {
                        location.reload();

                    } else {
                        alert("Unexpected error");
                    }
                }
            });
        } else {
            // Do nothing!
        }

    }

    $http.get('/education').
    success(function(data, status, headers, config) {
        if (data.length > 0) {
            $scope.profile.education = data;
            $rootScope.educationd = data;
            $scope.$apply();
        } else {

            $scope.profile.education = [{ "country": "Add up your education here", "degree": "", "start_date": "", "end_date": "", "id": "" }];
        }

    }).
    error(function(data, status, headers, config) {

    });

    $scope.editedu = function(x, y) {

        $("#edu" + x).replaceWith('<form id = "edit-edux' + x + '" name = "edit-edux' + x + '" onsubmit = " return savesneweducation()"><br><hr><input class= "w3-input" placeholder = "Country" name = "country" value = "' + $rootScope.educationd[y].country + '" required></input><input  class= "w3-input"  placeholder = "Degree" name = "degree" value = "' + $rootScope.educationd[y].degree + '" required></input><input  class= "w3-input" placeholder = "Start Year" name = "start_date" value = "' + $rootScope.educationd[y].start_date + '" required></input><input  class= "w3-input" placeholder = "End Year" name = "end_date"  value = "' + $rootScope.educationd[y].end_date + '" required></input><button type = "button" class = "w3-btn w3-teal w3-right w3-margin-bottom save-edu" id = "save-new-edu" onclick = "editeducation(' + x + ')">Save</button></form>');

    }

    $scope.removeEdu = function(x) {
        if (confirm('Are you sure you want to delete this education from your profile?')) {
            var data = "id=" + x;
            $.post({
                url: '/removeedu',
                data,
                success: function(result) {
                    if (result == "success") {
                        location.reload();

                    } else {
                        alert("Unexpected error");
                    }
                }
            });
        } else {
            // Do nothing!
        }

    }

    //-------------------skills

    $http.get('/skills').
    success(function(data, status, headers, config) {
        if (data.length > 0) {
            $scope.profile.skills = data;
            $rootScope.skillsd = data;
            $scope.$apply();
        } else {

            $scope.profile.skills = [{ "skill": "Add up your Skills here", "level": "0" }];
        }

    }).
    error(function(data, status, headers, config) {

    });

    $scope.editski = function(x, y) {

        $("#ski" + x).replaceWith('<form id = "edit-skix' + x + '" name = "edit-skix' + x + '" onsubmit = " return savesnewskills()"><br><hr><input class= "w3-input" placeholder = "Skill Name" name = "skill" value = "' + $rootScope.skillsd[y].skill + '" required></input><select style="margin-top:2%" class="w3-select" name="level" required><option selected>' + $rootScope.skillsd[y].level + '</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select><button type = "button" class = "w3-btn w3-teal w3-right w3-margin-bottom save-edu" id = "save-new-ski" onclick = "editskills(' + x + ')">Save</button></form>');

    }

    $scope.removeSki = function(x) {
        if (confirm('Are you sure you want to delete this Skill from your profile?')) {
            var data = "id=" + x;
            $.post({
                url: '/removeski',
                data,
                success: function(result) {
                    if (result == "success") {
                        location.reload();

                    } else {
                        alert("Unexpected error");
                    }
                }
            });
        } else {
            // Do nothing!
        }

    }

    $scope.follow = function() {
        var x = String(location.href);
        x = x.split("?");
        x = x[1];

        data = "email=" + x;
        $.post({
            url: '/follow',
            data,
            success: function(result) {
                if (result == "success") {
                    $("#follow-btn").html("Following");
                    $('#follow-btn').attr('disabled', true);


                } else {
                    alert("Unexpected error");
                }
            }
        });
    }


});
