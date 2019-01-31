function changeDiv(page){
    document.getElementById('connexion_view').hidden= true;
    document.getElementById('all_view').hidden= true;
    document.getElementById('search_view').hidden= true;
    document.getElementById('filter_view').hidden= true;
    document.getElementById('resume_view').hidden= true;
    document.getElementById('annotation_view').hidden= true;
    document.getElementById(page).hidden = false;
    console.log(page);
}
