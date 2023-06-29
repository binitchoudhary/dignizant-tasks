import { createStore } from 'vuex';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export default createStore({
  state: {
    posts: [],           // Holds the list of posts
    currentPage: 1,     // Holds the current page number for pagination
    pageSize: 10,       // Holds the number of posts per page
    nextId: 101,        // Initial value for the next ID
  },
  getters: {
    paginatedPosts: (state) => {
      // Retrieves the posts for the current page
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return state.posts.slice(startIndex, endIndex);
    },
    totalPages: (state) => Math.ceil(state.posts.length / state.pageSize), // Calculates the total number of pages based on the number of posts
  },
  mutations: {
    SET_POSTS(state, posts) {
      // Updates the state with the fetched posts
      state.posts = posts;
    },
    SET_CURRENT_PAGE(state, page) {
      // Updates the current page number
      state.currentPage = page;
    },
    ADD_POST(state, post) {
      // Adds a new post to the state and increments the nextId value
      state.posts.push(post);
      state.nextId++;
    },
    DELETE_POST(state, postId) {
      // Removes a post from the state based on its ID
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    UPDATE_POST(state, updatedPost) {
      // Updates a post in the state with the modified post object
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        state.posts.splice(index, 1, updatedPost);
      }
    },
  },
  actions: {
    async fetchPosts({ commit }) {
      // Fetches the posts from the API and commits them to the state
      try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const posts = await response.json();
        commit('SET_POSTS', posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    async createPost({ commit, state }, newPost) {
      // Creates a new post and adds it to the state
      try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
        const createdPost = await response.json();
        const postWithId = { ...createdPost, id: state.nextId };
        commit('ADD_POST', postWithId);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    },
    async deletePost({ commit }, postId) {
      // Deletes a post from the API and removes it from the state
      try {
        await fetch(`${API_BASE_URL}/posts/${postId}`, {
          method: 'DELETE',
        });
        commit('DELETE_POST', postId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    },
    async updatePost({ commit }, updatedPost) {
      // Updates a post in the API and updates it in the state
      try {
        await fetch(`${API_BASE_URL}/posts/${updatedPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost),
        });
        commit('UPDATE_POST', updatedPost);
      } catch (error) {
        console.error('Error updating post:', error);
      }
    },
    setCurrentPage({ commit }, page) {
      // Sets the current page number
      commit('SET_CURRENT_PAGE', page);
    },
  },
});
