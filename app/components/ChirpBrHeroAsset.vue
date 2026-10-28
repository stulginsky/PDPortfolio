<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
const props = defineProps<{src:string; width:number; height:number; boxStyle?:CSSProperties; media?:string}>()
const emit = defineEmits<{loaded:[]}>()
const imageStyle = computed<CSSProperties>(()=>props.width>0 ? {
 position:'absolute',left:0,top:0,width:props.width+'px',height:props.height+'px',maxWidth:'none',transformOrigin:'top left',
 transform:'scale(calc(100cqw / '+props.width+'px), calc(100cqh / '+props.height+'px))',
 pointerEvents:'none',userSelect:'none',
} : {position:'absolute',inset:0,width:'100%',height:'100%',objectFit:props.boxStyle?.objectFit || 'fill',pointerEvents:'none',userSelect:'none'})
</script>
<template><div :style="[boxStyle,{containerType:'size'}]"><picture><source v-if="media" :media="media" :srcset="src" /><img :src="media ? undefined : src" alt="" draggable="false" :style="imageStyle" @load="emit('loaded')" /></picture></div></template>