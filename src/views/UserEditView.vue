<template>
  <div class="user-form">
    <div class="form-header">
      <h1>Edit User</h1>
      <router-link to="/users" class="btn btn-secondary">
        Back to Users
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      Loading user data...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            :class="{ 'error': errors.name }"
            placeholder="Enter user name"
            required
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="Enter user email"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password (leave blank to keep current)</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password }"
            placeholder="Enter new password (optional)"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="password_confirmation" class="form-label">Confirm Password</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password_confirmation }"
            placeholder="Confirm new password"
          />
          <span v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation }}</span>
        </div>

        <div class="form-actions">
          <router-link to="/users" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Updating...' : 'Update User' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.password_confirmation = ''

  if (!form.name) {
    errors.name = 'Name is required'
  } else if (form.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid'
  }

  if (form.password && form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (form.password && !form.password_confirmation) {
    errors.password_confirmation = 'Password confirmation is required'
  } else if (form.password && form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match'
  }

  return !errors.name && !errors.email && !errors.password && !errors.password_confirmation
}

const loadUser = async () => {
  try {
    const userId = parseInt(route.params.id as string)
    const user = await usersStore.getUser(userId)
    
    form.name = user.name
    form.email = user.email
    form.password = ''
    form.password_confirmation = ''
  } catch (err: any) {
    error.value = err.message || 'Failed to load user'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const userId = parseInt(route.params.id as string)
    const updateData: any = {
      name: form.name,
      email: form.email
    }

    if (form.password) {
      updateData.password = form.password
      updateData.password_confirmation = form.password_confirmation
    }

    await usersStore.updateUser(userId, updateData)
    router.push('/users')
  } catch (err) {
    // Error is already handled in the store
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.user-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  color: var(--color-heading);
  margin: 0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary);
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.form-input.error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .form-header .btn {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
</style> 