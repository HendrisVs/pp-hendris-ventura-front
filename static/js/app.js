var app = angular.module("app", []); 
app.controller("Controller",  ['$scope', '$http','$q',  function ($scope, $http, $q, dataService){
    getAllInfo();

    $scope.submit = function() {
        var obj = {}
        name =   $scope.data.name; 
        mail = $scope.data.mail; 
        phone = $scope.data.phone; 
        password = $scope.data.password; 
        age = $scope.data.age; 
        hobby = $scope.data.hobby; 
        genre =   $scope.data.singleSelect; 
        
        registerDate = Date.now(); 
        obj =  {"name": name, 
            "mail": mail, 
            "phone": phone, 
            "password": password, 
            "age": age, 
            "hobby": hobby,
            "genre": genre, 
            "registerDate": registerDate
            }

        jsondata = JSON.stringify(obj)
        asyncPost(jsondata)
            .then(function(data)
                {
                getAllInfo(); 
                })
            .catch(function(err)
                {
                console.log(err); 
                }); 
        }

        function asyncPost(jsonData) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/users', jsonData).then(
                function (data) {
                    defered.resolve(data);
                }
                , function (data, status) {
                    defered.reject(data);
                }); 
            return promise;
            }; 

        function errorCallback(error){
            console.log(error); 
        }

        function  getAllInfo()
            {
            $http.get('/users').then(function(response) {
                listUsers = []
                users =  response.data
                names = []
                hobbies = []
                for (user in users)
                    {
                    id = users[user]._id
                    name =  users[user].name
                    hobby = users[user].hobby
                    registerDate = users[user].registerDate
                    phone = users[user].phone
                    genre = users[user].genre
                    age = users[user].age
                    userInf = {
                        "id":id,
                        "name": name, 
                        "hobby": hobby, 
                        "registerDate": registerDate, 
                        "phone": phone, 
                        "genre": genre, 
                        "age": age
                        }
                    listUsers.push(userInf)
                    if (names.includes(name)==false)
                        {
                        names.push(name); 
                        }
                    if (hobbies.includes(hobby)==false)
                        {
                        hobbies.push(hobby); 
                        }
                    }
                $scope.names = names; 
                $scope.hobbies = hobbies; 
                $scope.users =  listUsers; 
                $scope.$apply();  
                }
        , errorCallback);
        }

        $scope.searchFunction = function ()
            {
                name = ""
                hobby = ""
                if (typeof $scope.selectedName !== 'undefined')
                {
                    name = $scope.selectedName; 
                }
                if (typeof $scope.selectedHobby !== 'undefined')
                {
                    hobby = $scope.selectedHobby; 
                }
                listUsers = []
                var config = {
                    params: {
                        name: name,
                        hobby: hobby
                    }
                }

                
                $http.get('/users',  config).then(function(response) {
                    users =  response.data
                    for (user in users)
                        {
                        id =  users[user]._id
                        name =  users[user].name
                        hobby = users[user].hobby
                        registerDate = users[user].registerDate
                        phone = users[user].phone
                        genre = users[user].genre
                        age = users[user].age
                        userInf = {
                            "id":id, 
                            "name": name, 
                            "hobby": hobby, 
                            "registerDate": registerDate, 
                            "phone": phone, 
                            "genre": genre, 
                            "age":age
                            }
                        listUsers.push(userInf)
                        }
                    $scope.users =  listUsers; 
                    $scope.$apply();  
                    }
            , errorCallback);
            }
        $scope.searchAll = function ()
            {
            getAllInfo(); 
            }

        $scope.deleteUser = function (id)
            {
            asyncDel(id)
            .then(function(data)
                {
                getAllInfo(); 
                })
            .catch(function(err)
                {
                console.log(err); 
                }); 

            }

        function asyncDel(id) {
                var defered = $q.defer();
                var promise = defered.promise;
                $http.delete('/users/'+id,).then(
                    function (data) {
                        defered.resolve(data);
                    }
                    , function (data, status) {
                        defered.reject(data);
                    }); 
                return promise;
                }; 

        $scope.searchCustom = function ()
            {
            $http.get('/users/groups/').then(function(response) {
                    users =  response.data
                    listGroups = []
                    for (user in users)
                        {
                        tmpInfo = {"name": users[user].name, 
                                "phone": users[user].phone,
                                "hobby": users[user].hobby}
                        listGroups.push(tmpInfo); 
                        }

                    group = listGroups.reduce((r, a) => {
                        r[a.hobby] = [...r[a.hobby] || [], a];
                        return r;
                        }, {});
                        var myJSON = JSON.stringify(group);
                        myJSON = JSON.stringify(group,null,"    ")
                        $scope.TextArea = myJSON; 
                    }
                , errorCallback);
                }
}]);

