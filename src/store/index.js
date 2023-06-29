import { createStore } from 'vuex';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export default createStore({
  state: {
    posts: [],
    currentPage: 1,
    pageSize: 10,
    nextId: 101, // Initial value for the next ID
  },
  getters: {
    paginatedPosts: (state) => {
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = startIndex + state.pageSize;
      return state.posts.slice(startIndex, endIndex);
    },
    totalPages: (state) => Math.ceil(state.posts.length / state.pageSize),
  },
  mutations: {
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    ADD_POST(state, post) {
      state.posts.push(post);
      state.nextId++; // Increment the nextId value
    },
    DELETE_POST(state, postId) {
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    UPDATE_POST(state, updatedPost) {
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        state.posts.splice(index, 1, updatedPost);
      }
    },
  },
  actions: {
    async fetchPosts({ commit }) {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const posts = await response.json();
        commit('SET_POSTS', posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    },
    async createPost({ commit, state }, newPost) {
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
      commit('SET_CURRENT_PAGE', page);
    },
  },
});
