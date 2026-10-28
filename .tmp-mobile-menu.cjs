
const fs=require('fs');
let p='app/components/DsFullscreenMenuMob.vue',t=fs.readFileSync(p,'utf8').replaceAll('\r\n','\n');
t=t.replace("const isOpen = ref(false)","let openingTrigger: HTMLElement | null = null\nconst isOpen = ref(false)");
t=t.replace("  isActive.value = false\n  isOpen.value = true","  openingTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null\n  isActive.value = false\n  isOpen.value = true");
t=t.replace("triggerRef.value?.$el.focus()","(triggerRef.value?.$el ?? openingTrigger)?.focus()");
t=t.replace('    <DsButton\n','    <slot name="trigger" :open="open" :is-open="isOpen" :menu-id="menuId">\n    <DsButton\n');
t=t.replace('    <Teleport to="body">','    </slot>\n    <Teleport to="body">');
fs.writeFileSync(p,t);
p='app/components/DsBreadcrumbsMenu.vue';t=fs.readFileSync(p,'utf8').replaceAll('\r\n','\n');
t=t.replace('nextTick, onMounted, onUnmounted, ref','computed, nextTick, onMounted, onUnmounted, ref');
t=t.replace("import DsDropdownListSelector from './DsDropdownListSelector.vue'","import DsDropdownListSelector from './DsDropdownListSelector.vue'\nimport DsFullscreenMenuMob from './DsFullscreenMenuMob.vue'");
t=t.replace('const isOpen = ref(false)',`const mobile = ref(false)
let query: MediaQueryList | undefined
function updateMobile() { mobile.value = Boolean(query?.matches); isOpen.value = false }
const mobileItems = computed(() => props.items.map(item => ({ label: item.label, value: item.id })))
function mobileSelect(item: { value: string }) {
  const selected = props.items.find(entry => entry.id === item.value)
  if (selected) emit('select', selected)
}
const isOpen = ref(false)`);
t=t.replace("onMounted(() => {","onMounted(() => {\n  query = window.matchMedia('(max-width: 767px)')\n  updateMobile()\n  query.addEventListener('change', updateMobile)");
t=t.replace("onUnmounted(() => {","onUnmounted(() => {\n  query?.removeEventListener('change', updateMobile)");
t=t.replace('    <button\n',`    <DsFullscreenMenuMob v-if="mobile" :items="mobileItems" aria-label="История переходов" @select="mobileSelect" @close="emit('close')">
      <template #trigger="{ open, isOpen: opened, menuId: controlledId }">
        <button ref="triggerRef" class="ds-breadcrumbs-menu__trigger" type="button"
          :aria-expanded="opened" :aria-controls="controlledId" aria-haspopup="dialog" @click="open">...</button>
      </template>
    </DsFullscreenMenuMob>
    <button v-else
`);
t=t.replace('v-if="isOpen"','v-if="isOpen && !mobile"');
fs.writeFileSync(p,t);
