<template>
  <div class="demo-restart-footer">
    <button
      type="button"
      class="demo-restart"
      @click="handleRestart"
    >
      Leave and start over
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRestartDemoFlow } from "../hooks/useRestartDemoFlow";

const props = defineProps<{
  onBeforeRestart?: () => void;
}>();

const restart = useRestartDemoFlow();

function handleRestart() {
  props.onBeforeRestart?.();
  restart();
}
</script>
