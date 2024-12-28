<script setup lang="ts">
const route = useRoute()

onMounted(() => {
  // 获取 URL 中的 code 参数
  const code = route.query.code as string

  if (code) {
    // 将 code 参数添加到 claim 页面的 URL 中
    window.location.href = `/claim?access_token=${code}`
  }
  else {
    // 如果没有 code，直接返回 claim 页面
    window.location.href = '/claim'
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p>Redirecting...</p>
  </div>
</template>
