// repo detail
if (document.querySelector('.pagehead-actions')) {
  const author = document.querySelector('#js-repo-pjax-container span.author > a').innerText
  const repoName = document.querySelector('#js-repo-pjax-container .repohead.instapaper_ignore.readability-menu.experiment-repo-nav > div > h1 > strong > a').innerText
  const repoKey = author + '/' + repoName

  chrome.storage.local.get('github-repo-notes', res => {
    let obj = res['github-repo-notes'] || {}
    let el = document.querySelector('div.repository-content .text-gray-dark')   // the program with `its own` notes
      || document.querySelector('.repository-content .Details-element') // the program without `its own` notes
    let html
    const note = obj[repoKey]
    // with/whtout user's note
    if (note) {
      html =
      `
      <div style="display: inline-block; margin-bottom: 10px">
        <div class="btn-group">
          <span id="origin-notes-content">${note}</span>
          <a href="javascript:;" class="btn btn-sm" id="add-notes-btn">Edit Note</a>
        </div>
        <div style="display:none;margin-bottom:-5px;" id="edit-notes-area">
          <textarea class="form-control comment-form-textarea" id="notes-content">${note}</textarea>
          <a href="javascript:;" class="btn btn-sm btn-primary" id="save-notes-btn" style="margin: 5px 0">Save</a>
          <a href="javascript:;" class="btn btn-sm btn-danger" id="del-notes-btn" style="margin: 5px 0">Delete</a>
        </div>
      </div>
      `
    } else {
      html =
      `
      <div style="margin-bottom: 10px">
        <div class="btn-group" style="margin-bottom: 10px">
          <a href="javascript:;" class="btn btn-sm" id="add-notes-btn">Add Note</a>
        </div>
        <div style="display:none;" id="edit-notes-area">
          <textarea class="form-control comment-form-textarea" id="notes-content"></textarea>
          <a href="javascript:;" class="btn btn-sm btn-primary" id="save-notes-btn" style="margin-top: 5px">Save</a>
          <a href="javascript:;" class="btn btn-sm btn-danger" id="del-notes-btn" style="margin-top: 5px">Delete</a>
        </div>
      </div>
      `
    }

    el.insertAdjacentHTML('afterend', html)

    const editErea = document.querySelector('#edit-notes-area')
    const notesContentOld = document.querySelector('#origin-notes-content')
    const notesContentNew = document.querySelector('#notes-content')
    const addNoteBtn = document.querySelector('#add-notes-btn')
    const saveNoteBtn = document.querySelector('#save-notes-btn')
    const delNoteBtn = document.querySelector('#del-notes-btn')

    const guard = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleBtn = (type) => {
      chrome.storage.local.get('github-repo-notes', res => {
        let obj = res['github-repo-notes'] || {}
        if (type === 'add') {
          obj[repoKey] = notesContentNew.value
        } else if (type === 'del') {
          delete obj[repoKey]
        }

        chrome.storage.local.set({ 'github-repo-notes': obj }, () => {
          location.reload()
        })
      })
    }

    addNoteBtn.addEventListener('click', (e) => {
      guard(e)
      editErea && (editErea.style.display = 'block')
      notesContentOld && (notesContentOld.style.display = 'none')
      addNoteBtn && (addNoteBtn.style.display = 'none')
    })

    saveNoteBtn.addEventListener('click', (e) => {
      guard(e)
      handleBtn('add')
    })

    delNoteBtn.addEventListener('click', (e) => {
      guard(e)
      handleBtn('del')
    })

    /* click the black area to close the edit area */
    document.addEventListener('click', () => {
      editErea && (editErea.style.display = 'none')
      notesContentOld && (notesContentOld.style.display = 'initial')
      addNoteBtn && (addNoteBtn.style.display = 'initial')
    })
    editErea && editErea.addEventListener('click', (e) => {
      guard(e)
    })
  })
}
