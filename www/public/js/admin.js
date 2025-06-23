document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');
        const dropdownArrow = dropdown.querySelector('.dropdown-arrow');


        submenu.style.display = 'none';

        link.addEventListener('click', function (e) {
            e.preventDefault();
            const isVisible = submenu.style.display === 'block';

 
            document.querySelectorAll('.submenu').forEach(sm => sm.style.display = 'none');
            document.querySelectorAll('.dropdown-arrow').forEach(da => da.textContent = '▼');


            if (!isVisible) {
                submenu.style.display = 'block';
                dropdownArrow.textContent = '▲';
            }
        });
    });
});

function loadAdmin(){

    document.addEventListener("DOMContentLoaded", function() {
        const sidebarLinks = document.querySelectorAll(".sidebar nav ul li a");
        const dAdminContainer = document.querySelector('.d-admin');
    
        function loadDefaultAdminView() {
            const defaultViewName = "admin"; 
            loadAdminPartialView(defaultViewName);
    
            sidebarLinks.forEach(function(item) {
                const href = item.getAttribute("href").replace("/../../", "").replace(".html", "");
                if (href === defaultViewName) {
                    item.parentElement.classList.add('nav-item', 'active');
                } else {
                    item.parentElement.classList.remove('nav-item', 'active');
                }
            });
        }
    
        loadDefaultAdminView();
    
        sidebarLinks.forEach(function(link) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                
                const viewName = link.dataset.view;
                
                loadAdminPartialView(viewName);
    
                const slist = document.getElementById("show-list");
                if (slist.style.display === "block") {
                    slist.style.display = "none";
                }
                
    
                sidebarLinks.forEach(function(item) {
                    item.parentElement.classList.remove('nav-item', 'active');
                });
    
                link.parentElement.classList.add('nav-item', 'active');
            });
        });

        function loadAdminPartialView(viewName) {
            const url = `views/Admin_Views/${viewName}.html`;
    
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    dAdminContainer.innerHTML = data;
                    if (viewName == 'users') {
                        loadUsers()
                    }
                    if (viewName == 'encargados') {
                        loadEncargados()
                    }
                    if (viewName == 'alumnos') {
                        loadAlumnos()
                    }
                    if (viewName == 'admin') {
                        loadDicaA()
                    }
                    if (viewName == 'admi'){
                        loadDicaB()
                    }
                    if (viewName == 'requests') {
                        loadRequests()
                    }
                    if (viewName == 'groups') {
                        loadGroups()
                    }
                    if (viewName == 'notification') {
                        loadAvisos()
                    }
                    if (viewName == 'departamentos') {
                        loadDepartamentos()
                    }
                })
                .catch(error => {
                    console.error('Error fetching partial view:', error);
                });
        }
        
    
        const buttonpress = document.getElementById("r-button");
        const slist = document.getElementById("show-list");
    
        buttonpress.addEventListener("click", function(event) {
            event.preventDefault();
    
            if (slist.style.display === "none") {
                slist.style.display = "block";
            } else {
                slist.style.display = "none";
            }
        });
    });
    
}    
loadAdmin();
