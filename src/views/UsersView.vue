<template>
  <div class="users">
    <div class="users-header">
      <h1>Users Management</h1>
      <router-link to="/users/create" class="btn btn-primary">
        Add New User
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      Loading users...
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <h3>No users found</h3>
      <p>Get started by creating your first user.</p>
      <router-link to="/users/create" class="btn btn-primary">
        Create User
      </router-link>
    </div>

    <div v-else class="users-table">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>{{ formatDate(user.updated_at) }}</td>
            <td class="actions">
              <router-link :to="`/users/${user.id}/edit`" class="btn btn-secondary btn-sm">
                Edit
              </router-link>
              <button @click="confirmDelete(user)" class="btn btn-danger btn-sm">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete user "{{ userToDelete?.name }}"?</p>
        <p>This action cannot be undone.</p>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteUser" class="btn btn-danger" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'vue-toastification'

const usersStore = useUsersStore()
const toast = useToast()

const loading = computed(() => usersStore.loading)
const users = computed(() => usersStore.users)

const showDeleteModal = ref(false)
const userToDelete = ref<any>(null)
const deleting = ref(false)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const confirmDelete = (user: any) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  deleting.value = true
  try {
    await usersStore.deleteUser(userToDelete.value.id)
    closeDeleteModal()
  } catch (error) {
    // Error is already handled in the store
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<style scoped>
.users {
  max-width: 1200px;
  margin: 0 auto;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.users-header h1 {
  color: var(--color-heading);
  margin: 0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.empty-state h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
}

.users-table {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.modal p {
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .users-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .users-header .btn {
    width: 100%;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 