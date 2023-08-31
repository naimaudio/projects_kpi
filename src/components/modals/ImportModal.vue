<template>
    <ModalComponent @close="emits('close')">
        <div class="container">
            <h2>Declarations Import</h2>
            <p>Import employee records with the same format as export.</p>
            <form id="file-upload-form" ref="form" class="uploader">
                <input id="file-upload" type="file" name="fileUpload" accept="text/csv" @change="fileSelectHandler" />

                <label
                    id="file-drag"
                    for="file-upload"
                    :class="{
                        hover: fileDraggedOver,
                    }"
                    @dragover="fileDragHover"
                    @dragleave="fileDragHover"
                    @drop="fileSelectHandler"
                >
                    <div v-show="file === undefined" id="start">
                        <UploadIcon />
                        <div>Select a file or drag here</div>
                        <div class="pointer" style="height: fit-content; width: fit-content; margin: 0 auto">
                            <BaseButton type="button" partly-disabled accent big>Select a file</BaseButton>
                        </div>
                    </div>
                    <div v-show="!greatFile && file !== undefined" id="response">
                        <div>{{ messages }}</div>
                        <strong>{{ strongMessages }}</strong>
                        <BaseButton
                            style="margin: 45px auto 0 auto; min-width: 100px"
                            type="button"
                            :disabled="file === undefined || importLoading"
                            :loading="importLoading"
                            accent
                            big
                            @click="uploadFile"
                            >Upload</BaseButton
                        >
                    </div>
                </label>
            </form>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from "@/components/ModalComponent.vue";
import { ref } from "vue";
import UploadIcon from "@/components/icons/UploadIcon.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { postImportCsv } from "@/API/requests";
import { useGlobalStore } from "@/stores/globalStore";
import { initialization } from "@/utilities/initialization";
const emits = defineEmits<{
    (event: "close"): void;
}>();

const globalStore = useGlobalStore();

const fileDraggedOver = ref<boolean>(false);
const greatFile = ref<boolean>(true);
const importLoading = ref<boolean>(false);
const strongMessages = ref<string>("");
const messages = ref<string>("");

const form = ref<HTMLFormElement>();
const file = ref<File | undefined>();
function fileDragHover(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    fileDraggedOver.value = e.type === "dragover";
}
function fileSelectHandler(e: Event) {
    // Fetch File object
    file.value = ((e.target as HTMLInputElement)?.files || (e as DragEvent).dataTransfer?.files || [undefined])[0];

    // Cancel event and hover styling
    fileDragHover(e);
    if (file.value !== undefined) {
        parseFile(file.value);
    }
}

function parseFile(file: File) {
    strongMessages.value = file.name;
    let imageName = file.name;
    let isGood = /\.(?=csv)/gi.test(imageName);
    if (!isGood) {
        greatFile.value = true;
        globalStore.notification.content = "Please provide a csv file";
        globalStore.notification.type = "FAILURE";
        globalStore.notification.display = true;
    } else {
        greatFile.value = false;
    }
}

function uploadFile() {
    importLoading.value = true;
    if (file.value !== undefined) {
        postImportCsv(file.value)
            .then((response) => {
                if (response.status === 200) {
                    globalStore.notification.display = true;
                    globalStore.notification.type = "SUCCESS";
                    globalStore.notification.content = "Declarations successfully imported";
                } else {
                    globalStore.notification.display = true;
                    globalStore.notification.type = "FAILURE";
                    globalStore.notification.content =
                        "An error occurred during import, please check that each week declared by the user has a sum of hours equal to 35 hours.";
                }
                importLoading.value = false;
            })
            .then(() => {
                initialization();
                emits("close");
            });
    }
}
</script>

<style scoped>
.uploader {
    display: block;
    clear: both;
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
}
.container {
    height: 250px;
}
label {
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
        border-color: var(--theme);
    }
    &.hover {
        border: 3px solid var(--theme);
        box-shadow: inset 0 0 0 6px #eee;

        #start {
            i.fa {
                transform: scale(0.8);
                opacity: 0.3;
            }
        }
    }
}

#start {
    float: left;
    clear: both;
    width: 100%;
    i.fa {
        font-size: 50px;
        margin-bottom: 1rem;
        transition: all 0.2s ease-in-out;
    }
}
#response {
    display: flex;
    flex-direction: column;
    float: left;
    clear: both;
    width: 100%;
    #messages {
        margin-bottom: 0.5rem;
    }
}

#file-image {
    display: inline;
    margin: 0 auto 0.5rem auto;
    width: auto;
    height: auto;
    max-width: 180px;
}

#notimage {
    display: block;
    float: left;
    clear: both;
    width: 100%;
}

input[type="file"] {
    display: none;
}

div {
    margin: 0 0 0.5rem 0;
    color: #5f6982;
}
.btn {
    display: inline-block;
    margin: 0.5rem 0.5rem 1rem 0.5rem;
    clear: both;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    text-transform: initial;
    border: none;
    border-radius: 0.2rem;
    outline: none;
    padding: 0 1rem;
    height: 36px;
    line-height: 36px;
    color: #fff;
    transition: all 0.2s ease-in-out;
    box-sizing: border-box;
    background: var(--theme);
    border-color: var(--theme);
    cursor: pointer;
}

.pointer {
    cursor: pointer;
}
</style>
