import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.find('.spinner-circle').exists()).toBe(true)
  })

  it('should render with custom size', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: '60px'
      }
    })

    const spinner = wrapper.find('.spinner')
    expect(spinner.attributes('style')).toContain('width: 60px')
    expect(spinner.attributes('style')).toContain('height: 60px')
  })

  it('should render with overlay when specified', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        overlay: true
      }
    })

    expect(wrapper.classes()).toContain('loading-overlay')
  })

  it('should render with custom message', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        message: 'Chargement des données...'
      }
    })

    expect(wrapper.text()).toContain('Chargement des données...')
    expect(wrapper.find('.loading-message').exists()).toBe(true)
  })
})
