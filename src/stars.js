function initStarsPage() {
  chrome.storage.local.get('github-repo-notes', res => {
    let obj = res['github-repo-notes'] || {}
    let list = document.querySelectorAll('.col-12.d-block.width-full.py-4.border-bottom')

    list.forEach((item, index) => {
      let repoKey = item.querySelector('div.d-inline-block.mb-1 > h3 > a').getAttribute('href').substring(1)
      const note = obj[repoKey]

      // with/without note
      if (note) {
        var el = item
        var html =
        `<div>
          <div class="btn-group" style="margin-top:10px; margin-bottom:5px">
            <span class="origin-notes-content">${note}</span>
            <a class="btn btn-sm add-notes-btn">Edit Note</a>
          </div>
          <div style="display:none;margin-top:10px;" class="edit-notes-area">
            <textarea class="form-control comment-form-textarea notes-content" style="margin-bottom:5px">${note}</textarea>
            <a class="btn btn-sm btn-primary save-notes-btn">Save</a>
            <a class="btn btn-sm btn-danger del-notes-btn">Delete</a>
          </div>
        </div>`
      } else {
        var el = item
        var html =
        `<div>
          <div class="btn-group">
            <a class="btn btn-sm add-notes-btn" style="margin-top:10px; margin-bottom:5px">Add Note</a>
          </div>
          <div style="display:none;margin-top:10px;" class="edit-notes-area">
            <textarea class="form-control comment-form-textarea notes-content" style="margin-bottom:5px"></textarea>
            <a class="btn btn-sm btn-primary save-notes-btn">Save</a>
          </div>
        </div>`
      }
      el.insertAdjacentHTML('beforeend', html)
    })

    const handleBtn = (type, e) => {
      chrome.storage.local.get('github-repo-notes', res => {
        let obj = res['github-repo-notes'] || {}
        let repoKey = e.target.parentNode.parentNode.parentNode.querySelector('div.d-inline-block.mb-1 > h3 > a').getAttribute('href').substring(1)
        if (type === 'add') {
          obj[repoKey] = e.target.parentNode.parentNode.querySelector('.notes-content').value
        } else if (type === 'del') {
          delete obj[repoKey]
        }

        chrome.storage.local.set({ 'github-repo-notes': obj }, () => {
          location.reload()
        })
      })
    }

    const guard = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    /* Event delegation. If the element to be click is edit aree, the edit area should keep show,
    Otherwise the edit area should hide. */
    document.body.addEventListener('click', (e) => {
      let classList = e.target.classList
      const editNotesArea = e.target.parentNode.parentNode.querySelector('.edit-notes-area')
      const btnGroup = e.target.parentNode.parentNode.querySelector('.btn-group')
      const notesContentOld = e.target.parentNode.parentNode.querySelector('.origin-notes-content')
      if (classList.contains('notes-content')) {
        return
      }
      try {
        notesContentOld && (notesContentOld.style.display = 'block')
      } catch (err) { }
      if (classList.contains('add-notes-btn')) {
        editNotesArea && (editNotesArea.style.display = 'block')
        btnGroup.style.display = 'none'
        try {
          notesContentOld.style.display = 'none'
        } catch (err) { }
        return
      } else if (classList.contains('save-notes-btn')) {
        handleBtn('add', e)
        return
      } else if (classList.contains('del-notes-btn')) {
        handleBtn('del', e)
        return
      }
      editNotesArea && (editNotesArea.style.display = 'none')
      btnGroup && (btnGroup.style.display = 'block')
    })

    /* match the key word */
    let listHtml = ''
    let val = ''
    for (let k in obj) {
      let v = obj[k]
      listHtml += `
      <li class="d-flex flex-justify-start flex-items-center p-0 f5 navigation-item js-navigation-item">
        <a class="no-underline d-flex flex-auto flex-items-center p-2 jump-to-suggestions-path js-jump-to-suggestion-path js-navigation-open" aria-label="Jump to..." href="/${k}" data-target-type="Repository" data-target-id="128907699" data-client-rank="0" data-server-rank="2">
          <div class="jump-to-octicon js-jump-to-octicon mr-2 text-center"><svg height="16" width="16" class="octicon octicon-repo flex-shrink-0 js-jump-to-repo-octicon-template" title="Repository" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg></div>
          <img class="avatar mr-2 flex-shrink-0 js-jump-to-suggestion-avatar d-none" alt="" src="" width="28" height="28">
          <div class="repos jump-to-suggestion-name js-jump-to-suggestion-name flex-auto overflow-hidden no-wrap css-truncate css-truncate-target">${k}</div>
          <div class="intos">${v}</div>

          <div class="border rounded-1 flex-shrink-0 bg-gray px-1 text-gray-light ml-1 f6 d-none d-on-nav-focus js-jump-to-badge-search">
            Search
            <span class="d-inline-block ml-1 v-align-middle">↵</span>
          </div>

          <div class="border rounded-1 flex-shrink-0 bg-gray px-1 text-gray-light ml-1 f6 d-on-nav-focus js-jump-to-badge-jump">
            Jump to
            <span class="d-inline-block ml-1 v-align-middle">↵</span>
          </div>
        </a>
      </li>
      `
    }

    let html = `
    <div class="header-search js-site-search position-relative" role="search" style="margin-bottom:10px">
      <div class="position-relative">
        <form class="js-site-search-form">
          <label id="repo-list" class="form-control header-search-wrapper">
            <input type="text" class="fuzzy-search form-control header-search-input jump-to-field-active" value="" placeholder="Search or jump to…">
            <div class="Box position-absolute overflow-hidden jump-to-suggestions js-jump-to-suggestions-container" style="display:none">
              <ul class="list js-navigation-container jump-to-suggestions-results-container js-jump-to-suggestions-results-container js-active-navigation-container">
                ${listHtml}
              </ul>
            </div>
          </label>
        </form>
      </div>
    </div>
    `

    document.querySelector('#js-pjax-container .d-md-flex').insertAdjacentHTML('beforebegin', html)

    const repoList = new List('repo-list', {
      valueNames: ['repos', 'intos']
    })

    /* first the list hide, and the input will show when it has words  */
    const fuzzySearch = document.getElementsByClassName('fuzzy-search')[0]
    const listContainer = document.getElementsByClassName('js-jump-to-suggestions-container')[1]
    fuzzySearch.addEventListener('input', e => {
      val = e.target.value.trim()
      if (val) {
        listContainer.style.display = 'block'
      } else {
        listContainer.style.display = 'none'
      }
    })
  })
}

let url = location.href
let p = /.*\/\/github.com\/.*\?tab=stars.*/

if (p.test(url)) {
  initStarsPage()
}