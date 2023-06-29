<template>
  <div class="container mx-auto p-4">
    <!-- Button to open the modal for creating a new post -->
    <button @click="openModal('create')" class="custom-button create-post">
      Create New Post
    </button>

    <!-- Table to display the posts -->
    <table class="custom-table">
      <thead class="thead">
        <tr>
          <th class="custom-th">ID</th>
          <th class="custom-th custom-padding">Title</th>
          <th class="custom-th custom-padding">Body</th>
          <th class="custom-th">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through the posts and display each post in a table row -->
        <tr v-for="post in paginatedPosts" :key="post.id" class="custom-tr">
          <td class="custom-td">{{ post.id }}</td>
          <td class="custom-td td-padding">{{ post.title }}</td>
          <td class="custom-td td-padding post-body">{{ post.body }}</td>
          <td class="custom-td btns">
            <!-- Button to open the modal for editing a post -->
            <button @click="openModal('edit', post)" class="custom-button edit-btn">
              <i class="fas fa-edit"></i>
            </button>

            <!-- Button to delete a post -->
            <button @click="deletePost(post.id)" class="custom-button delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination buttons -->
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1" class="custom-button prev">
        Previous
      </button>
      <span class="custom-span">{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="custom-button next">
        Next
      </button>
    </div>

    <!-- Modal for creating/editing a post -->
    <div class="modal" id="postModal">
      <div class="modal-content">
        <h2 class="custom-heading">{{ modalTitle }}</h2>
        <form @submit.prevent="submitPost" class="custom-form">
          <div class="create-title">
            <label for="edit-title" class="custom-label">Title:</label>
            <input type="text" id="edit-title" v-model="editedPost.title" required class="custom-input">
          </div>
          <div class="create-body">
            <label for="edit-body" class="custom-label">Body:</label>
            <textarea id="edit-body" v-model="editedPost.body" required class="custom-textarea"></textarea>
          </div>
          <div class="flex">
            <!-- Button to create/save a post -->
            <button type="submit" class="custom-button create-save">
              {{ creatingPost ? 'Create' : 'Save' }}
            </button>

            <!-- Button to cancel editing a post -->
            <button @click="cancelEdit" class="custom-button cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    paginatedPosts() {
      return this.$store.getters.paginatedPosts;
    },
    currentPage() {
      return this.$store.state.currentPage;
    },
    totalPages() {
      return this.$store.getters.totalPages;
    },
    nextPostId() {
      return this.$store.state.posts.length + 1;
    },
  },
  data() {
    return {
      editingPost: false,
      creatingPost: false,
      editedPost: {
        id: null,
        title: '',
        body: '',
      },
      modalTitle: '',
    };
  },
  created() {
    this.$store.dispatch('fetchPosts');
  },
  methods: {
    openModal(mode, post = null) {
      if (mode === 'create') {
        // Set modal state for creating a new post
        this.creatingPost = true;
        this.editingPost = false;
        this.modalTitle = 'Create New Post';
        this.editedPost = {
          id: null,
          title: '',
          body: '',
        };
      } else if (mode === 'edit') {
        // Set modal state for editing an existing post
        this.creatingPost = false;
        this.editingPost = true;
        this.modalTitle = 'Edit Post';
        this.editedPost = {
          id: post.id,
          title: post.title,
          body: post.body,
        };
      }
      this.showModal();
    },
    showModal() {
      const modal = document.getElementById('postModal');
      modal.style.display = 'block';
    },
    closeModal() {
      const modal = document.getElementById('postModal');
      modal.style.display = 'none';
    },
    editPost(post) {
      this.openModal('edit', post);
    },
    deletePost(postId) {
      this.$store.dispatch('deletePost', postId);
    },
    cancelEdit() {
      this.closeModal();
      this.editingPost = false;
      this.creatingPost = false;
      this.editedPost = {
        id: null,
        title: '',
        body: '',
      };
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.$store.dispatch('setCurrentPage', this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$store.dispatch('setCurrentPage', this.currentPage + 1);
      }
    },
    submitPost() {
      if (this.creatingPost) {
        this.$store.dispatch('createPost', this.editedPost);
      } else {
        this.$store.dispatch('updatePost', this.editedPost);
      }
      this.closeModal();
      this.cancelEdit();
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  position: relative;
}

/* Styles for the create post button */
.create-post {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: lightgreen;
  border: 1px solid lightseagreen;
}

/* Styles for the table */
.custom-table {
  border-collapse: collapse;
  width: 100%;
}

/* Styles for table header */
.custom-padding {
  padding: 0 2rem !important;
}

/* Styles for table cells with padding */
.td-padding {
  padding: 0 1.5rem;
  text-align: left !important;
}

/* Styles for table header row */
.thead {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
  background: #CED2CC;
}

/* Styles for table body */
tbody{
  background: gray;
  color: #fff;
}

/* Styles for table header cells */
.custom-th {
  padding: 6px;
  background: blue;
  color: #fff;
}

/* Styles for table rows */
.custom-tr{
  color: black;
}

/* Styles for alternating table rows */
.custom-tr:nth-child(even) {
  background-color: #f9f9f9;
}

.custom-tr:nth-child(odd) {
  background-color: #ffffff;
}

/* Styles for table cells */
.custom-td {
  text-align: center;
}

/* Styles for action buttons */
.btns {
  display: flex;
  padding: 12px 0;
}

.edit-btn,
.delete-btn {
  font-size: 15px;
  margin-right: 20px;
  background: none;
  border: none;
}

/* Styles for delete button */
.delete-btn{
  color: red;
}

/* Styles for edit button */
.edit-btn{
  color: blue;
}

/* Styles for center alignment */
.items-center {
  text-align: center;
  margin-top: 1rem;
}

/* Styles for pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

/* Styles for previous and next buttons in pagination */
.prev,
.next {
  padding: 0.5rem;
  margin: 0 0.5rem;
  background: #0cb130;
  border: 1px solid lightgray;
}

/* Styles for post body */
.post-body {
  text-align: left;
  padding: 0 1rem;
}

/* Styles for modal */
.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

/* Styles for modal content */
.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  background: #DADADA;
}

/* Styles for modal heading */
.custom-heading {
  text-align: center;
}

/* Styles for form inside modal */
.custom-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

/* Styles for form label */
.custom-label {
  padding-right: 20px;
  margin: 0.5rem;
}

/* Styles for form input and textarea */
.custom-input,
.custom-textarea {
  width: 100%;
  max-width: 300px;
  height: 3rem;
}

/* Styles for create post title section */
.create-title,
.create-body {
  margin: 1rem 0;
}

/* Styles for create/save button */
.create-save {
  margin: 1.5rem;
  padding: 0.5rem;
  background: green;
}

/* Styles for cancel button */
.cancel {
  padding: 0.5rem;
  background: red;
}

@media (max-width: 640px) {
  /* Responsive styles for smaller screens */

  /* Styles for table cells with padding */
  .custom-padding {
    padding: 0 0.5rem !important;
  }

  /* Styles for table cells */
  .td-padding {
    padding: 0 0.5rem;
  }

  /* Styles for post body */
  .post-body {
    padding: 0;
  }

  /* Styles for modal content */
  .modal-content {
    margin: 20% auto;
  }
}
</style>
