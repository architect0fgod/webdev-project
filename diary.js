// ==========================================================
// DIARY — diary.html only
// ==========================================================
function initDiary() {
    const notesList = document.getElementById('notesList');
    const noteContent = document.getElementById('noteContent');
    const newNoteTitle = document.getElementById('newNoteTitle');
    const addNoteBtn = document.getElementById('addNoteBtn');

    let diaryNotes = JSON.parse(localStorage.getItem('diaryNotes')) || [];
    let editingIndex = null; // index of note currently being edited, or null

    // Build edit UI (hidden by default)
    const editWrapper = document.createElement('div');
    editWrapper.id = 'editWrapper';
    editWrapper.style.display = 'none';
    editWrapper.style.marginTop = '15px';
    editWrapper.style.padding = '15px';
    editWrapper.style.background = '#2a1e33';
    editWrapper.style.borderRadius = '8px';
    editWrapper.style.border = '1px solid #3a2a45';

    const editTitle = document.createElement('input');
    editTitle.type = 'text';
    editTitle.placeholder = 'Note title';
    editTitle.style.width = '100%';
    editTitle.style.padding = '8px';
    editTitle.style.marginBottom = '10px';
    editTitle.style.background = '#120d18';
    editTitle.style.color = '#e8e0ea';
    editTitle.style.border = '1px solid #3a2a45';
    editTitle.style.borderRadius = '4px';

    const editContent = document.createElement('textarea');
    editContent.placeholder = 'Note content...';
    editContent.style.width = '100%';
    editContent.style.height = '120px';
    editContent.style.marginBottom = '10px';
    editContent.style.background = '#120d18';
    editContent.style.color = '#e8e0ea';
    editContent.style.border = '1px solid #3a2a45';
    editContent.style.borderRadius = '4px';
    editContent.style.resize = 'vertical';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '8px';
    btnRow.style.justifyContent = 'flex-end';

    const saveEditBtn = document.createElement('button');
    saveEditBtn.textContent = 'Save Changes';
    saveEditBtn.style.padding = '6px 12px';

    const cancelEditBtn = document.createElement('button');
    cancelEditBtn.textContent = 'Cancel';
    cancelEditBtn.style.padding = '6px 12px';
    cancelEditBtn.style.background = '#444';
    cancelEditBtn.style.color = '#e8e0ea';

    btnRow.appendChild(saveEditBtn);
    btnRow.appendChild(cancelEditBtn);
    editWrapper.appendChild(editTitle);
    editWrapper.appendChild(editContent);
    editWrapper.appendChild(btnRow);

    // Insert edit wrapper after noteContent
    noteContent.parentNode.insertBefore(editWrapper, noteContent.nextSibling);

    function renderNotes() {
        notesList.innerHTML = '';
        if (diaryNotes.length === 0) {
            notesList.innerHTML = '<li>No notes yet. Click "Add Note" to add one.</li>';
            return;
        }
        diaryNotes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note.title;
            li.dataset.index = index;
            li.style.cursor = 'pointer';
            li.style.padding = '8px';
            li.style.borderBottom = '1px solid #3a2a45';
            li.addEventListener('click', () => {
                if (editingIndex !== null) return; // don't select while editing
                showNote(index);
            });
            notesList.appendChild(li);
        });
    }

    function showNote(index) {
        editingIndex = null;
        editWrapper.style.display = 'none';
        const note = diaryNotes[index];
        noteContent.innerHTML = `
            <p><strong>Title:</strong> ${note.title}</p>
            <p><strong>Content:</strong> ${note.content}</p>
            <hr style="margin:12px 0; border:none; border-top:1px solid #3a2a45;">
            <button id="editNoteBtn" style="padding:6px 12px; margin-right:8px;">Edit Note</button>
            <button id="deleteNoteBtn" style="padding:6px 12px; background:#c44;">Delete</button>
        `;

        document.getElementById('editNoteBtn').addEventListener('click', () => startEdit(index));
        document.getElementById('deleteNoteBtn').addEventListener('click', () => {
            if (confirm('Delete this note?')) {
                diaryNotes.splice(index, 1);
                localStorage.setItem('diaryNotes', JSON.stringify(diaryNotes));
                renderNotes();
                noteContent.innerHTML = '<p>Select a note to view</p>';
            }
        });
    }

    function startEdit(index) {
        editingIndex = index;
        const note = diaryNotes[index];
        editTitle.value = note.title;
        editContent.value = note.content;
        editWrapper.style.display = 'block';
        noteContent.innerHTML = '';
    }

    saveEditBtn.addEventListener('click', () => {
        if (editingIndex === null) return;
        const title = editTitle.value.trim();
        if (!title) return;
        const savedIndex = editingIndex;
        diaryNotes[savedIndex].title = title;
        diaryNotes[savedIndex].content = editContent.value.trim();
        localStorage.setItem('diaryNotes', JSON.stringify(diaryNotes));
        editingIndex = null;
        editWrapper.style.display = 'none';
        renderNotes();
        if (diaryNotes.length > 0) {
            showNote(savedIndex < diaryNotes.length ? savedIndex : diaryNotes.length - 1);
        } else {
            noteContent.innerHTML = '<p>Select a note to view</p>';
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        editingIndex = null;
        editWrapper.style.display = 'none';
        if (diaryNotes.length > 0) showNote(0);
        else noteContent.innerHTML = '<p>Select a note to view</p>';
    });

    addNoteBtn.addEventListener('click', () => {
        const title = newNoteTitle.value.trim();
        if (!title) return;

        const newNote = {
            id: Date.now(),
            title: title,
            content: `Diary entry for ${new Date().toLocaleDateString()}`,
        };
        diaryNotes.push(newNote);
        localStorage.setItem('diaryNotes', JSON.stringify(diaryNotes));

        renderNotes();
        newNoteTitle.value = '';
        showNote(diaryNotes.length - 1);
    });

    renderNotes();
    if (diaryNotes.length > 0) {
        showNote(0);
    }
}

if (window.location.pathname.includes('diary.html')) {
    initDiary();
}
