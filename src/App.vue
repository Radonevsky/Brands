<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">Error has occured: {{ error }}</div>
    <div v-if="treeData">
      <root-item
        v-for="(brand, idx) in brands"
        :key="idx"
        :array-brand="brand"
        :changeBrand="changeBrand"
        :changeInProgress="changeInProgress"
        :deleteBrand="deleteBrand"
      />
    </div>
    <div v-if="createServerError" style="color: red">Server error: {{createServerError}}</div>
    <input
      type="text"
      placeholder="Add new"
      v-model="newBrandTitle"
      @click="validatorOff"
      @change="validatorOff"
    />
    <strong v-if="required" style="color: red">Required!</strong>
    <input type="checkbox" id="checkbox" v-model="checked" />
    <label for="checkbox" style="padding: 0 5px"> main:{{ checked }}</label>
    <button @click="submitCreateBrand">Add</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { actionTypes } from '@/store/modules/tree'
import RootItem from '@/components/RootItem'

export default {
  name: 'App',
  data() {
    return {
      newBrandTitle: '',
      checked: false,
      required: false,
    }
  },
  components: {
    RootItem,
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.tree.isLoading,
      treeData: (state) => state.tree.data,
      error: (state) => state.tree.error,
      changeInProgress: (state) => state.tree.changeInProgress,
      createServerError:(state) => state.tree.createError,
    }),
    brands() {
      return this.$store.getters.splittedBrands
    },
  },
  methods: {
    changeBrand(newData) {
      this.$store.dispatch(actionTypes.changeBrand, newData)
    },
    removeBrand(id) {
      this.$store.dispatch(actionTypes.removeBrand, id)
    },
    submitCreateBrand() {
      if (this.newBrandTitle === '') {
        this.validatorOn()
        return
      }
      this.createBrand({
        main: this.checked,
        title: this.newBrandTitle,
      })
      this.newBrandTitle = ''
      this.required = false
    },
    validatorOn() {
      this.required = true
    },
    validatorOff() {
      this.required = false
    },
    createBrand(newBrand) {
      this.$store.dispatch(actionTypes.createBrand, newBrand)
    },
    deleteBrand(id) {
      this.$store.dispatch(actionTypes.deleteBrand, id)
    }
  },
  mounted() {
    return this.$store.dispatch(actionTypes.getTree)
  },
}
</script>
