<template>
    <ModalComponent @close="emits('close')">
        <div id="file-upload-form" class="uploader">
            <input id="file-upload" type="file" accept="text/csv" @change="onUpload" />
            <label for="file-upload"
                ><strong>Choose a file</strong><span class="box__dragndrop"> or drag it here</span>
                <div id="start">
                    <i class="fa fa-download" aria-hidden="true"></i>
                    <div>Select a file or drag here</div>
                    <div id="notimage" class="hidden">Please select an image</div>
                    <span id="file-upload-btn" class="btn btn-primary">Select a file</span>
                </div>
            </label>
            <button class="box__button" type="submit">Upload</button>
        </div>
        <!-- <div v-if="uploading" class="box__uploading">Uploading…</div>
        <div v-if="success" class="box__success">Done!</div>
        <div v-if="error" class="box__error">Error! <span></span>.</div> -->
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import { ref } from "vue";

const file = ref<File | undefined>(undefined);
const emits = defineEmits<{
    (event: "close"): void;
}>();

const onUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    file.value = target.files === null ? undefined : target.files[0];
};
</script>
<style scoped>
.uploader {
    display: block;
    clear: both;
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
}
#file-upload {
    float: left;
    clear: both;
    width: 100%;
    padding: 2rem 1.5rem;
    text-align: center;
    background: #fff;
    border-radius: 7px;
    border: 3px solid #eee;
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
        border-color: #454cad;
    }
    &.hover {
        border: 3px solid #454cad;
        box-shadow: inset 0 0 0 6px #eee;

        #start {
            i.fa {
                transform: scale(0.8);
                opacity: 0.3;
            }
        }
    }
}
</style>
