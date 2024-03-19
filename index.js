
const saved = document.querySelector('.saved');
const autocomplete = document.querySelector('.autocomplete');
const searchInput = document.querySelector('#search-input');

function debounce (fn, debounceTime) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => 
            fn.apply(this, args), debounceTime);
  };
};

searchInput.addEventListener('keyup', debounce(() => {
    autocomplete.textContent = '';
    searchRepositories();
}, 500));


async function searchRepositories() {
    const query = searchInput.value.trim();
    if (!query) {
        autocomplete.textContent = '';
        return;
    }
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`);
        if (!response.ok) {
            throw new Error('Error fetch');
        }
        const repositories = await response.json();
        repositories.items.slice(0, 5).forEach(showRepo);
    }
    catch(error){
        console.log(error);
    };
}

function showRepo(repository) {
    const repo = document.createElement('li')
    repo.className = 'repository';
    repo.textContent = repository.name

    let obj = {
        name: repository.name,
        owner: repository.owner.login,
        stars: repository.stargazers_count
        }

    repo.dataset.info = JSON.stringify(obj)

    autocomplete.append(repo)
}


autocomplete.addEventListener('click', (e) => {
    e.target.classList.add('clicked');

    const repositoryOptions = JSON.parse(e.target.dataset.info);

    const resultsSaved = document.createElement('li');

    const repoName = document.createElement('div');
    repoName.textContent = `Name: ${repositoryOptions.name}`;

    const repoOwner = document.createElement('div');
    repoOwner.textContent = `Owner: ${repositoryOptions.owner}`;

    const repoStar = document.createElement('div');
    repoStar.textContent = `Stars: ${repositoryOptions.stars}`;

    const repoClose = document.createElement('div');
    repoClose.className = 'close-button';
    repoClose.textContent = 'X';

    repoClose.addEventListener('click', function(e) {
        e.target.closest('li').remove();
        e.stopPropagation();
    });

    resultsSaved.appendChild(repoName);
    resultsSaved.appendChild(repoOwner);
    resultsSaved.appendChild(repoStar);
    resultsSaved.appendChild(repoClose);

    saved.append(resultsSaved);

    searchInput.value = "";

});


