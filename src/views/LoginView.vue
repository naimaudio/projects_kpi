<template>
    <div class="card-support">
        <div class="card">
            <span class="sub-title">Login</span>
            <fluent-text-field>Username</fluent-text-field>
            <fluent-text-field>Password</fluent-text-field>
            <div class="footer-buttons">
                <fluent-button class="larger-button" appearance="accent" @click="addFavoriteProjects"
                    >Connect</fluent-button
                >
            </div>
        </div>
    </div>
</template>

<script></script>

<style>
.card {
    background-color: #fff;
    padding: 44px;
    margin-bottom: 28px;
    width: 340px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.card-support {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    background-image: url("https://aadcdn.msftauth.net/shared/1.0/content/images/backgrounds/2_11d9e3bcdfede9ce5ce5ace2d129f1c4.svg");
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.larger-button {
    width: 100px;
    font-size: 15px;
}
</style>
