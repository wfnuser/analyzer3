<script setup lang="ts">
import type { Donation } from '@/utils/contract'
import { getDonations } from '@/utils/contract'

onMounted(async () => {})

const githubHandle = ref('')
const loading = ref(false)
const donations = ref<Donation[]>([])
const toast = useToast()

async function fetchDonations() {
  if (!githubHandle.value) {
    toast.add({ title: 'Please enter your GitHub handle', color: 'red' })
    return
  }

  loading.value = true
  try {
    donations.value = await getDonations(githubHandle.value)
  }
  catch (error) {
    console.error(error)
    toast.add({ title: 'Failed to fetch donations', color: 'red' })
  }
  finally {
    loading.value = false
  }
}

async function claim(githubHandle: string, index: number) {
  loading.value = true
  try {
    await claimDonation(githubHandle, index)
    toast.add({ title: 'Successfully claimed!', color: 'green' })
    await fetchDonations()
  }
  catch (error) {
    console.error(error)
    toast.add({ title: 'Failed to claim donation', color: 'red' })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center min-h-screen">
    <div class="w-full max-w-md flex flex-col items-center space-y-12 mt-8">
      <h2 class="text-2xl font-semibold">
        Claim Your Reward
      </h2>
      <div class="w-full space-y-6">
        <UFormGroup label="GitHub Handle" required>
          <UInput
            v-model="githubHandle"
            placeholder="Enter your GitHub handle"
          />
        </UFormGroup>
        <UButton
          :loading="loading"
          block
          variant="solid"
          @click="fetchDonations"
        >
          <template #leading>
            <UIcon name="i-heroicons-magnifying-glass" />
          </template>
          Fetch Donations
        </UButton>
      </div>
      <!-- if loading  -->
      <div v-if="loading" class="w-full">
        <div class="flex items-center justify-center h-full">
          <UIcon name="i-eos-icons:loading" class="w-8 h-8 text-gray" />
        </div>
      </div>
      <div v-else-if="donations.length > 0" class="w-full">
        <UTable
          v-if="donations.length"
          :rows="donations"
          :columns="[
            {
              key: 'project',
              label: 'Project',
            },
            {
              key: 'amount',
              label: 'Amount',
            },
            {
              key: 'actions',
              label: 'Actions',
            },
          ]"
        >
          <template #actions-data="{ row }">
            <UButton
              v-if="!row.claimed"
              size="xs"
              color="green"
              @click="claim(githubHandle, row.index)"
            >
              Claim
            </UButton>
            <UButton v-else size="xs" color="gray" disabled>
              Claimed
            </UButton>
          </template>
        </UTable>
      </div>
      <div v-else class="w-full">
        <p class="text-center text-gray-500">
          No donations yet. Keep contributing to your favorite projects!
        </p>
      </div>
    </div>
  </div>
</template>
