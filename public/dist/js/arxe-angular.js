String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.max = function (mx) {
    return this.filter(function (e, i) { return i < mx; });
};

Array.prototype.offset = function (os) {
    return this.filter(function (e, i) { return i > os - 1 });
};

var validate_time = function (input) {

    if (!input)
        return false;

    if (input.split(':')[0] < 24 && input.split(':')[1] < 60)
        return true;

    return false;

};

var time_diffrence = function (start, end) {

    var time1 = start.split(':'), time2 = end.split(':');
    var hours1 = parseInt(time1[0], 10),
        hours2 = parseInt(time2[0], 10),
        mins1 = parseInt(time1[1], 10),
        mins2 = parseInt(time2[1], 10);
    var hours = hours2 - hours1, mins = 0;

    // get hours
    if (hours < 0) hours = 24 + hours;

    // get minutes
    if (mins2 >= mins1) {
        mins = mins2 - mins1;
    }
    else {
        mins = (mins2 + 60) - mins1;
        hours--;
    }

    // convert to fraction of 60

    //  hours += mins;
    return {
        hours: hours,
        mins: mins,
        totalHour: hours + mins / 60
    };

};

var use_persons = function ($scope, $http) {
    $http.get('/api/users').then(function (res) {
        $scope.persons = res.data;
    });
}


var use_locations = function ($scope, $http) {
    $http.get('/api/locations').then(function (res) {
        $scope.locations = res.data;
    });
}

var use_projects = function ($scope, $http) {
    $http.get('/api/projects').then(function (res) {
        $scope.projects = res.data;
    });
}

var use_pager = function ($scope) {
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.getPager = function () {
        var pages = [];
        for (var i = 1; i <= Math.ceil($scope.items.length / $scope.pageSize); i++) {
            pages.push(i);
        }

        return pages;
    };
    $scope.getPage = function (pageNumber) {
        var pageItems = $scope.items.offset((pageNumber - 1) * $scope.pageSize).max($scope.pageSize);
        return pageItems;
    };
    $scope.setPageNumber = function (pageNumber) {
        $scope.currentPage = pageNumber;
    };
    $scope.$watch('pageSize', function (newVal, oldVal) {
        if (newVal < 1)
            $scope.pageSize = 1;

    });

};
var use_curd = function ($scope, $http, api_prefix) {

    $scope.items = [];
    $scope.clear = function () {
        $scope.model = {

        };
    };

    $scope.validate = function (model) {
        return true;
    };

    $scope.save = function (model) {

        if (!$scope.validate(model))
            return;

        $http.post(api_prefix + '/upsert', model).then(function (res) {

            if (res.data._id != undefined) {

                $scope.model = res.data;

                if (model._id == undefined) {
                    $scope.items.push($scope.model);

                    $.toast({
                        icon: 'info',
                        text: 'item saved !'
                    });

                } else {

                    $.toast({
                        icon: 'info',
                        text: 'item updated !'
                    });
                }

                $scope.clear();

            }

        });

    };
    $scope.remove = function (model) {

        var detailsList = $('<div style="text-align:left;" class="detailslist"><b>You will not be able to recover this :</b></div>');

        _.keys(model).forEach(function (key, index) {
            var value = model[key];

            if (key.endsWith("Id")) {

                key = key.replace("Id", "");
                value = _.findWhere($scope[key + "s"], { _id: value }).name;
            }


            detailsList.append("<div><b>" + key + " :</b><i> " + value + "</i></div>");
        });



        swal({
            title: "Are you sure?",
            text: " <br /> " + detailsList[0].outerHTML,
            type: "warning",
            html: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        },
            function (isConfirm) {


                if (isConfirm) {



                    $http.post(api_prefix + '/remove', model).then(function (res) {

                        $scope.items = _.filter($scope.items, function (item) {

                            return item._id != model._id;

                        });

                        $scope.clear();

                    });

                }

            });



    };
    $scope.edit = function (model) {

        $scope.model = model;

    };
    $http.get(api_prefix).then(function (res) {

        $scope.items = res.data;

    });
    $scope.clear();

};


/// Projects APP
var projectsApp = angular.module('projects', []);
projectsApp.controller('main', function ($scope, $http) {

    use_pager($scope);
    use_curd($scope, $http, '/api/projects');

});
/// Projects APP  \\\\\\\\\\\\\\\\\\\\


/// users APP
var usersApp = angular.module('users', []);
usersApp.controller('main', function ($scope, $http) {
    use_pager($scope);
    use_curd($scope, $http, '/api/users');



    $scope.changePassword = function (item) {

        swal({
            title: "Change Password",
            text: "Write new password for " + item.name,
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "new password",
            inputType: 'password'
        },
            function (inputValue) {
                if (inputValue === false) return false;

                if (inputValue === "") {
                    swal.showInputError("You need to write something!");
                    return false;
                }

                $http.post('/api/account/reset_pw', {
                    userId: item._id,
                    newPass: inputValue
                }).then(function (res) {

                    if (res.status == 200)
                        swal({
                            title: 'password changed !',
                            type: 'success'
                        });
                    else
                        swal({
                            title: 'something went wrong !',
                            type: 'error'
                        });
                });

            });



    };
});
/// users APP  \\\\\\\\\\\\\\\\\\\\


/// locations APP
var locationsApp = angular.module('locations', []);
locationsApp.controller('main', function ($scope, $http) {
    use_pager($scope);
    use_curd($scope, $http, '/api/locations');
});
/// locations APP  \\\\\\\\\\\\\\\\\\\\

/// locations APP
var fundsApp = angular.module('funds', []);
fundsApp.controller('main', function ($scope, $http) {
    use_pager($scope);
    use_persons($scope, $http);
    use_projects($scope, $http);
    use_curd($scope, $http, '/api/funds');
    $scope.toPayItems = [];

    $http.post('/api/analytics/salary', { all: true }).then(function (res) {

        console.log("user salary", res.data);

        $scope.analytics = res.data;

        _.keys(res.data.users).forEach(function (item, index) {

            var userSalary = res.data.users[item];


            $scope.toPayItems.push({
                description: "پرداخت نشده تایم شیت",
                personId: item,
                price: userSalary.userSalary * -1,
                dateJalali: moment().format('jYYYY/jMM/jDD'),
                date: moment().format('YYYY/MM/DD')
            });

        });

        setTimeout(function () {
            $scope.$apply();
            initTables();

        }, 100);


    }, function (res) {
        console.error('error getting salary analyticks', res);
    });



    $scope.getPerson = function (_id) {
        return _.findWhere($scope.persons, { _id: _id });
    };
    $scope.getProject = function (_id) {
        return _.findWhere($scope.projects, { _id: _id });
    };



    $scope.$watch('model.dateJalali', function (newVal, oldVal) {

        if (newVal)
            $scope.model.date = moment(newVal, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');

    });


    $scope.edit = function (model) {
        $scope.model = model;
        $scope.model.dateJalali = moment($scope.model.date).format('jYYYY/jMM/jDD');
    };

    $scope.clear = function () {
        $scope.model = {
            dateJalali: moment().format('jYYYY/jMM/jDD'),
            date: moment().format('YYYY/MM/DD'),
        };

    };

    $scope.fund = {
        cash: 0,
        expense: 0,
        income: 0
    };

    $scope.personBalance = [];
    $scope.projectBalance = [];
    var initTables = function () {

        $scope.personBalance = [];
        $scope.projectBalance = [];

        if ($scope.real_items == false || $scope.real_items == undefined)
            $scope.real_items = $scope.items;

        if ($scope.persons && $scope.toPayItems)
            $scope.persons.forEach(function (item, index) {


                var personBalance = _.reduce(_.where($scope.items, { personId: item._id }), function (memo, item) {

                    return memo + item.price;

                }, 0);
                var salary = _.findWhere($scope.toPayItems, {
                    personId: item._id
                });



                if (salary)
                    personBalance = personBalance + salary.price;


                $scope.personBalance.push({
                    name: item.name,
                    balance: personBalance

                });

            });

        $scope.personBalanceSum = _.reduce($scope.personBalance, function (memo, item) {

            return memo + item.balance;

        }, 0);



        if ($scope.projects)
            $scope.projects.forEach(function (item, index) {

                var _balance = _.reduce(_.where($scope.items, { projectId: item._id }), function (memo, _item) {

                    return memo + _item.price;

                }, 0);

                if ($scope.analytics)
                    if ($scope.analytics.projects[item._id])
                        _balance -= $scope.analytics.projects[item._id];

                $scope.projectBalance.push({
                    name: item.name,
                    balance: _balance
                });

            });


        $scope.fund.cash = _.reduce($scope.items, function (memo, item) {

            if (item.projectId)
                return memo + item.price;

            if (item.personId)
                if (item.price > 0)
                    return memo - item.price;

            return memo;

        }, 0);

        //$scope.fund.expense = _.reduce($scope.items, function (memo, item) {

        //    if (item.price < 0)
        //        return memo + item.price;
        //    else
        //        return memo;

        //}, 0);


        //$scope.fund.income = _.reduce($scope.items, function (memo, item) {

        //    if (item.price > 0)
        //        return memo + item.price;
        //    else
        //        return memo;

        //}, 0);


        setTimeout(function () {
            $scope.$apply();
        }, 500);


    };
    $scope.$watch('items', function (newVal) {

        initTables();



    });


    $scope.search_items = function () {


        if ($scope.real_items == false || $scope.real_items == undefined)
            $scope.real_items = $scope.items;



        $scope.items = _.filter($scope.items, function (item) {

            var item_date_jalali = parseInt(item.dateJalali.replaceAll('/', ''));

            if ($scope.search == undefined)
                return true;

            if ($scope.search.startDate != '' && $scope.search.startDate != undefined)
                if ((item_date_jalali - parseInt($scope.search.startDate.replaceAll('/', ''))) < 0)
                    return false;

            if ($scope.search.endDate != '' && $scope.search.endDate != undefined)
                if ((item_date_jalali - parseInt($scope.search.endDate.replaceAll('/', ''))) > 0)
                    return false;


            if ($scope.search.projectId != undefined)
                if ($scope.search.projectId != item.projectId)
                    return false;

            if ($scope.search.personId != undefined)
                if ($scope.search.personId != item.personId)
                    return false;

            if ($scope.search.personal)
                return item.personal;

            return true;

        });


    };

    $scope.cancel_search = function () {
        $scope.items = $scope.real_items
        $scope.real_items = false;
        $scope.search = {};


    };
    $scope.clear();

});
/// locations APP  \\\\\\\\\\\\\\\\\\\\


/// wages APP
var wagesApp = angular.module('wages', []);
wagesApp.controller('main', function ($scope, $http) {


    use_pager($scope);
    use_curd($scope, $http, '/api/wages');
    use_persons($scope, $http);


    $scope.clear = function () {
        $scope.model = {
            startJalali: moment().format('jYYYY/jMM/jDD')
        };
    };

    $scope.getPerson = function (_id) {
        return _.findWhere($scope.persons, { _id: _id });
    };

    $scope.clear();

    $scope.$watch('model.startJalali', function (newVal, oldVal) {

        $scope.model.start = moment(newVal, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');

    });


    $scope.edit = function (model) {
        $scope.model = model;
        $scope.model.startJalali = moment($scope.model.start).format('jYYYY/jMM/jDD');
    };


});

wagesApp.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

/// wages APP  \\\\\\\\\\\\\\\\\\\\


/// timesheets APP
var timesheetsApp = angular.module('timesheets', []);

timesheetsApp.filter('moment', function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});


timesheetsApp.controller('main', function ($scope, $http) {

    use_pager($scope);

    use_persons($scope, $http);
    use_locations($scope, $http);
    use_projects($scope, $http);

    use_curd($scope, $http, '/api/timesheets');

    $scope.validate = function (model) {
        if (!validate_time(model.start) || !validate_time(model.end)) {
            swal({
                type: 'warning',
                title: 'validation failed !',
                text: 'check your start and end time .'
            });
            return false;
        }

        return true;
    };

    $scope.getTime = function (item) {
        return time_diffrence(item.start, item.end);
    };

    $scope.getWorkingTime = function (item) {
        var totalWorking = time_diffrence(item.start, item.end).totalHour - time_diffrence('00:00', item.personal).totalHour;
        return $scope.toTimeObj(totalWorking);

    };

    $scope.toTimeObj = function (totalHours) {
        return {
            hours: parseInt(totalHours),
            mins: parseInt((totalHours - parseInt(totalHours)) * 60)
        };
    };

    $scope.getPerson = function (_id) {
        return _.findWhere($scope.persons, { _id: _id });
    };

    $scope.getProject = function (_id) {
        return _.findWhere($scope.projects, { _id: _id });
    };

    $scope.getLocation = function (_id) {
        return _.findWhere($scope.locations, { _id: _id });
    };


    $scope.analytics = {
        totalSalary: 0,
        totalPaidSalary: 0,
        totalUnpaidSalary: 0,
    };



    $scope.clear = function () {

        $scope.model = {
            dateJalali: moment().format('jYYYY/jMM/jDD'),
            date: moment().format('YYYY/MM/DD'),
            personId: $scope.user._id
        };


        setTimeout(function () {
            $scope.$apply();
        }, 1);



    };

    $http.get('/api/user').then(function (res) {
        $scope.user = res.data;
        $scope.clear();
    });


    $scope.$watch('items', function (newVal) {

        console.log("item change");


        $scope.totalHours = _.reduce($scope.items, function (memo, item) {


            if (!item.personal)
                item.personal = '00:00';
            else
                item.personal = item.personal.toString();

            if (item.personal.indexOf(':') == -1)
                item.personal = '00:00';

            return memo + (time_diffrence(item.start, item.end).totalHour - time_diffrence('00:00', item.personal).totalHour);
        }, 0);

        $scope.totalPersonalHours = _.reduce($scope.items, function (memo, item) {

            if (!item.personal)
                return memo;

            if (item.personal.indexOf(':') == -1)
                return memo;


            return memo + time_diffrence('00:00', item.personal).totalHour;

        }, 0);


        var postData = _.map($scope.items, function (item) {
            return item._id;
        });


        if (postData.length == 0)
            return;



        $http.post('/api/analytics/salary', postData).then(function (res) {

            console.log(res.data);

            $scope.analytics = res.data;


            setTimeout(function () {
                $scope.$apply();
            }, 2);

        }, function (res) {
            console.error('error getting salary analyticks', res);
        });


        setTimeout(function () {
            $scope.$apply();
        }, 2);

    });


    $scope.$watch('model.dateJalali', function (newVal, oldVal) {

        if (newVal)
            $scope.model.date = moment(newVal, 'jYYYY/jMM/jDD').format('YYYY/MM/DD');

    });


    $scope.edit = function (model) {
    
        $scope.model = model;

        

        $scope.model.dateJalali = moment($scope.model.date).format('jYYYY/jMM/jDD');
    };

    $scope.search_items = function () {


        if ($scope.real_items == false || $scope.real_items == undefined)
            $scope.real_items = $scope.items;



        $scope.items = _.filter($scope.items, function (item) {

            var item_date_jalali = parseInt(item.dateJalali.replaceAll('/', ''));

            if ($scope.search == undefined)
                return true;

            if ($scope.search.startDate != '' && $scope.search.startDate != undefined)
                if ((item_date_jalali - parseInt($scope.search.startDate.replaceAll('/', ''))) < 0)
                    return false;

            if ($scope.search.endDate != '' && $scope.search.endDate != undefined)
                if ((item_date_jalali - parseInt($scope.search.endDate.replaceAll('/', ''))) > 0)
                    return false;



            if ($scope.search.locationId != undefined)
                if ($scope.search.locationId != item.locationId)
                    return false;

            if ($scope.search.projectId != undefined)
                if ($scope.search.projectId != item.projectId)
                    return false;

            if ($scope.search.personId != undefined)
                if ($scope.search.personId != item.personId)
                    return false;

            if ($scope.search.personal)
                return item.personal;

            return true;

        });


    };

    $scope.cancel_search = function () {
        $scope.items = $scope.real_items
        $scope.real_items = false;
        $scope.search = {};


    };


});

/// timesheets APP\\\\\\\\\\\\\\\\\\\\