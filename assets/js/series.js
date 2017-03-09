/**
 * Created by lukashavenga on 2016/07/13.
 */

(function() {
    //Current Page tracked in isolated function to prevent HTML manual updates
    var currentPage = 1;

    //Init call to get data
    //No Parameters set on inital call (empty object sent)
    var parameters = {};
    getData(displayData,parameters);

    function getData(callback,parameters){
        var formData = new FormData();
        formData.append("method","getSeries");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                displayData(xmlHttp.responseText);
            }
        }
        xmlHttp.open("post", "./seriesData.php");
        xmlHttp.send(formData);
    }

    //Get data callback, Build table when data is ready
    function displayData(data){
        if(data != "" || data != null){
            buildTable(data);
        }else{
            alert("Error getting data");
        }
    }

    //Builds and rebuilds the table
    function buildTable(users){
        //Get pagination settings
        var pagedUsers = JSON.parse(users);
        //If users object is valid, build table
        if(pagedUsers){
            console.log(pagedUsers);
            //Current Grid Table to populate
            gridBody = document.getElementById("dataGrid").children.gridBody;
            gridBody.innerHTML = "";
            //Map over every user and add entry
            pagedUsers.map(function(user){
                var row = document.createElement("div");
                row.className = "gridRow";
                gridBody.appendChild(row);
                //For each data value, create a cell entry
                for(var data_type in user){
                    var cell = document.createElement("div");
                    cell.className = "gridColumn cell "+data_type;
                    cell.innerHTML = user[data_type];
                    row.appendChild(cell);
                }
            });
        }
    }

    //Resets Table
    function rebuildTable(){
        //No Parameters on rebuild (empty object sent)
        var parameters = {};
        getData(buildTable,parameters)
    };

    //Filter functionality
    //Filters the current Data object
    function filterTableData(filterBy,asc){
        var parameters = {"filterBy":filterBy, "asc":asc};
        //Call to get data from "Back-end"
        getData(filterCallback,parameters);
    }
    //Filter Callback
    function filterCallback(data,parameters){
        var filterBy = parameters["filterBy"];
        var asc = parameters["asc"];
        //Sort a copy of the data object and return it
        var filteredData = data.slice(0);
        filteredData.sort(function(a,b){
            if(a[filterBy]){
                if (a[filterBy] < b[filterBy]) {
                    //If Ascending or Descending order
                    return asc == "asc"? -1: 1;
                } else if (a[filterBy] > b[filterBy]) {
                    //If Ascending or Descending order
                    return asc == "asc"? 1: -1;
                } else {
                    return 0;
                }
            }
        });
        buildTable(filteredData);
    }

    //Typeahead Search Functionality
    //Display results rellevant to what's being entered into search box
    //Lookup is done on all fields
    function typeaheadSearch(str,callback){
        var parameters = {"str":str};
        //Call to get data from "Back-end"
        getData(searchCallback,parameters);
    }
    //typeaheadSearch Callback
    function searchCallback(data,parameters){
        var str = parameters["str"];
        var searchResults = [];
        for(var i = 0;i < data.length; ++i){
            user = data[i];
            var contains = false;
            for(var field in user){
                contains = user[field].toString().toLowerCase().trim().indexOf(str) > -1;
                if(contains){
                    break;
                }
            }
            if(contains){
                searchResults.push(user);
            }
        }
        //Build Table
        buildTable(searchResults);
    }

    //Gets current pagination setting and filters data to limit by set amount on UI, returns paged data
    function pagination(data){
        //Get current pagination setting
        var totalData = data.length;
        var pagination = document.getElementById("pagination").value.toLowerCase();
        var paginationInfo = document.getElementById("paginationInfo");
        var increment = 100;
        switch (pagination){
            case "25":
                increment = 25;
                break;
            case "50":
                increment = 50;
                break;
            case "100":
                increment = 100;
                break;
            default:
                increment = totalData;
        }
        //When searching: increment cant ever be less than result
        if(increment > totalData){
            increment = totalData;
        }
        //Check that page increment doesn't exceed total pages
        if(currentPage <= totalData/increment){
            var pagedData = data.slice(0);
            //Pagination Info as follows: increment = amount filtered by, totalData = Total records, currentPage = current index, total/increment = total indices
            paginationInfo.innerHTML = "Showing "+increment+" of "+totalData+" on Page "+currentPage+" of "+Math.ceil(totalData/increment);
            pagedData = data.slice(increment * (currentPage-1),increment * (currentPage));
            return pagedData;
        }else{
            //Remove increment and avoid table rebuild
            if(currentPage > 1){
                --currentPage;
            }
            return false;
        }
    }

    //Event Listeners
    document.addEventListener("DOMContentLoaded", function(event) {
        //Filter By column clicks
        var carrets = document.getElementsByClassName("filterCaret");
        for (var i = 0; i < carrets.length; ++i) {
            carrets[i].addEventListener("click", function () {
                //Filter Data by selected column
                //if this Filter is already set, invert order
                var filteredBy = document.querySelector(".filterCaret[active='true']");
                if(filteredBy != null && filteredBy.id == this.id){
                    if(this.getAttribute("orderBy") == "asc"){
                        this.setAttribute("orderBy","desc");
                    }else{
                        this.setAttribute("orderBy","asc");
                    }
                }
                //Filter Data by the current filter and to filter Ascending or Descending
                filterTableData(this.id, this.getAttribute("orderBy"));

                //Saves current active filter to element and switch caret
                for (var n = 0; n < carrets.length; ++n) {
                    carrets[n].setAttribute("active","false");
                }
                this.setAttribute("active","true");
            });
        }

        //On text input in searchbar
        document.getElementById("search").onkeyup = function(e) {
            var search = this;
            if(search.value.length > 1){
                typeaheadSearch(search.value.toLowerCase().trim());
            }else if(search.value == ""){
                rebuildTable();
            }
        }

        //On Pagination value change
        document.getElementById("pagination").onchange = function(){
            //Reset Page Index
            currentPage = 1;
            //Rebuild Table with pagination updates
            rebuildTable();
        };

        //On back page click
        document.getElementById("pageBack").addEventListener("click",function(){
            //Prevents page to go bellow 1
            if(currentPage > 1){
                --currentPage;
                //Rebuild Table with pagination updates
                rebuildTable();
            }
        });

        //On next page click
        document.getElementById("pageForward").addEventListener("click",function(){
            ++currentPage;
            //Rebuild Table with pagination updates
            rebuildTable();
        });
    });

})();
