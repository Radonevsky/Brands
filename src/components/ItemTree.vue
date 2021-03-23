<template>
  <div style="padding-left: 20px">
    <span>{{ brand.title }} ({{ brand.main }})</span>
    <span
      @click="editToggle"
      style="text-decoration: underline; padding: 0 5px; cursor: pointer"
      >Изменить</span
    >
    <div v-if="editMode" style="display: inline">
      <input
        type="text"
        placeholder="New title"
        v-model="newTitle"
        @click="validatorOff"
        @change="validatorOff"
      />
      <strong v-if="required" style="color: red">Required!</strong>
      <input type="checkbox" id="checkbox" v-model="checked" />
      <label for="checkbox" style="padding: 0 5px"> main:{{ checked }}</label>
      <button v-on:click="changeBrandSubmit">Save</button>
    </div>
    <button v-if="!editMode" v-on:click="submitDeleteBrand">Delete</button>
  </div>
</template>
<script>
export default {
  name: 'ItemTree',
  props: {
    brand: {
      type: Object,
      required: true,
    },
    changeBrand: {
      type: Function,
      required: true,
    },
    deleteBrand: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      editMode: false,
      checked: false,
      newTitle: '',
      required: false,
    }
  },
  methods: {
    editToggle() {
      this.editMode = !this.editMode
    },
    validatorOn() {
      this.required = true
    },
    validatorOff() {
      this.required = false
    },
    changeBrandSubmit() {
      if (this.newTitle === '') {
        this.validatorOn()
        return
      }
      this.editToggle()
      this.changeBrand({
        id: this.brand._id,
        title: this.newTitle,
        main: this.checked,
      })
      this.newTitle = ''
    },
    submitDeleteBrand() {
      this.deleteBrand(this.brand._id)
    },
  },
}
</script>
