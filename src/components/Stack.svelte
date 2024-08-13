<script>
    import { onMount } from "svelte";
    import OutputsModal from "./OutputsModal.svelte";

    export let fileKey = "";

    let data;
    let resources = [];
    let showModal = false;
    let selectedOutputs = {};

    onMount(async function () {
        const response = await fetch("/api/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: fileKey }),
        });
        const json = await response.json();
        data = JSON.parse(json.data);
        console.debug('▶️ Resources list data:', data);

        const resourcesKey = data.checkpoint.latest ? 'latest' : (data.checkpoint.Latest ? 'Latest' : null);
        resources = data.checkpoint[resourcesKey].resources;
    });

    function openModal(outputs) {
        selectedOutputs = outputs;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedOutputs = {};
    }
</script>

<article aria-busy={fileKey.trim() !== "" ? false : true}>
    <h3 aria-busy={(data) ? false : true}>{(data) ? `Version: ${data.version}` : ''}</h3>
    <table>
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Type</th>
                <th scope="col">Created</th>
                <th scope="col">Modified</th>
                <th scope="col">Outputs</th>
            </tr>
        </thead>
        <tbody>
            {#if data}
                {#each resources as resource}
                    {#if resource.id && !resource.type.includes("providers")}
                        <tr>
                            <td>{resource.id}</td>
                            <td>{resource.type}</td>
                            <td>{resource.created}</td>
                            <td>{resource.modified}</td>
                            <td>
                                <button on:click={() => openModal(resource.outputs)}>Show</button>
                            </td>
                        </tr>
                    {/if}
                {/each}
            {/if}
        </tbody>
    </table>
</article>

<OutputsModal show={showModal} outputs={selectedOutputs} closeModal={closeModal} />

<style>
    article {
        text-align: center;
        margin: 0;
    }

    table {
        width: 100%;
        overflow-x: auto;
    }
</style>