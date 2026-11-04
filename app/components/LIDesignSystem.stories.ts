import type {Meta,StoryObj} from '@storybook/vue3-vite'
import {expect,fn,userEvent,waitFor} from 'storybook/test'
import {computed,ref} from 'vue'
import LIDesignSystem from './LIDesignSystem.vue'

const meta={
 title:'Compositions/Showcase cards/LIDesignSystem',component:LIDesignSystem,tags:['autodocs', '!dev'],
 parameters:{layout:'padded',docs:{description:{component:"Интерактивная карточка кейса «LIDesignSystem» для витрины проектов.\n\n<a href=\"https://www.figma.com/design/TPjPitung1VP3oQg42f56O/PDPortfolio-DS?node-id=3355-3103\" target=\"_blank\" rel=\"noopener noreferrer\">Figma</a>"}}},
 args:{onSubscribe:fn()},

  } satisfies Meta<typeof LIDesignSystem>
export default meta
type Story=StoryObj<typeof meta>
export const Preview:Story={
 args:{onSubscribe:fn((event:MouseEvent)=>event.preventDefault())},
 play:async({canvas,args})=>{
  const card=canvas.getByRole('article',{name:'LIDPORT DS'}),link=canvas.getByRole('link',{name:/Скоро/})
  await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
  await expect(canvas.getAllByRole('link')).toHaveLength(1)
  await expect(card).not.toHaveAttribute('tabindex')
  const uri=new URL(link.getAttribute('href')!)
  await expect(uri.protocol).toBe('mailto:')
  await expect(uri.pathname).toBe('stulginsky@gmail.com')
  await expect(uri.searchParams.get('body')).toBe('Привет, Константин! Очень хочу посмотреть новый кейс LIDPORT DS. Сообщите о публикации. Спасибо.')
  await expect(link).toHaveAttribute('target','_blank')
  await expect(link).toHaveAttribute('rel','noopener noreferrer')
  await userEvent.click(card)
  await expect(args.onSubscribe).not.toHaveBeenCalled()
  await userEvent.click(link)
  await expect(args.onSubscribe).toHaveBeenCalledTimes(1)
  await userEvent.hover(link)
  await expect(canvas.getByRole('tooltip')).toHaveTextContent(/Подписаться/)
  await expect(link).toHaveAttribute('aria-describedby',canvas.getByRole('tooltip').id)
  link.focus();await userEvent.keyboard('{Enter}')
  await expect(args.onSubscribe).toHaveBeenCalledTimes(2)
  await userEvent.keyboard('{Escape}')
  await waitFor(()=>expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument())
 },
}
export const Sandbox:Story={
  tags: ['dev'],
 render:args=>({components:{LIDesignSystem},setup(){
  const openMailClient=ref(false)
  const bindings=computed(()=>({...args,onSubscribe(event:MouseEvent){if(!openMailClient.value)event.preventDefault();args.onSubscribe?.(event)}}))
  return {openMailClient,bindings}
 },template:'<div style="display:grid;gap:16px"><label><input v-model="openMailClient" type="checkbox" />Открывать почтовый клиент</label><div style="width:100%;max-width:430px;resize:horizontal;overflow:auto;min-width:264px"><LIDesignSystem v-bind="bindings" /></div></div>'}),
 play:async({canvas})=>{
  if(new URLSearchParams(window.location.search).get('embed')==='true')return
  const toggle=canvas.getByRole('checkbox',{name:'Открывать почтовый клиент'}),link=canvas.getByRole('link',{name:/Скоро/})
  await expect(toggle).not.toBeChecked()
  const prevented:boolean[]=[]
  const observe=(event:Event)=>{prevented.push(event.defaultPrevented);event.preventDefault()}
  link.addEventListener('click',observe)
  try{await userEvent.click(link);await userEvent.click(toggle);await userEvent.click(link);await expect(prevented).toEqual([true,false])}
  finally{link.removeEventListener('click',observe);if((toggle as HTMLInputElement).checked)await userEvent.click(toggle)}
 },
}
