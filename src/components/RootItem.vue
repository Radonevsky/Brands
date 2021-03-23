<template>
  <div>
    <span v-if="show" @click="showToggle" style="cursor: pointer">[-]</span>
    <span v-if="!show" @click="showToggle" style="cursor: pointer">[+]</span>
    <strong style="padding-left: 10px">{{
      arrayBrand[0].title.slice(0, 1)
    }}</strong>
    <div v-if="show">
      <div v-for="(brand, idx) in arrayBrand" :key="idx">
        <item-tree
          :brand="brand"
          :changeBrand="changeBrand"
          :changeInProgress="changeInProgress"
          :deleteBrand="deleteBrand"
        ></item-tree>
      </div>
    </div>
    <div v-if="!show">
      <div
        v-for="(brand, idx) in minArrayBrand"
        :key="idx"
        style="padding-left: 20px"
      >
        {{ brand.title }} ({{ brand.main }})
      </div>
    </div>
  </div>
</template>

<script>
import ItemTree from '@/components/ItemTree'

export default {
  name: 'RootItem',
  props: {
    arrayBrand: {
      type: Array,
      required: true,
    },
    changeBrand: {
      type: Function,
      required: true,
    },
    changeInProgress: {
      type: Array,
      required: true,
    },
    deleteBrand: {
      type: Function,
      required: true,
    },
  },
  components: {
    ItemTree,
  },
  computed: {
    minArrayBrand() {
      const minArray = this.arrayBrand.slice()
      minArray.sort((a, b) => b.main - a.main)
      if (minArray.length > 5) {
        return minArray.slice(0, 5)
      }
      return minArray
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    showToggle() {
      this.show = !this.show
    },
  },
}
</script>
