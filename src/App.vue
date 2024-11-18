<template>
  <div class="container">
    <h2>Agenda de Contatos</h2>

    <div class="form-container">
      <InputText
        v-model="novoContato.nome"
        placeholder="Nome"
        class="input-field"
      />
      <InputText
        v-model="novoContato.email"
        placeholder="Email"
        class="input-field"
      />
      <InputMask
        v-model="novoContato.telefone"
        mask="(99) 99999-9999"
        placeholder="Telefone"
        class="input-field"
      />

      <Button
        label="Salvar"
        icon="pi pi-save"
        @click="saveContato"
        class="button"
      />
      <Button
        v-if="editando"
        label="Cancelar"
        icon="pi pi-times"
        @click="cancelarEdicao"
        class="button cancel-button"
      />
    </div>

    <div class="search-container">
      <InputText
        v-model="BuscarContato"
        placeholder="Buscar Contato"
        class="input-field"
      />
    </div>

    <div class="Contato-list">
      <div
        v-for="(contato, index) in FiltrarContato"
        :key="contato.id"
        class="Contato-item"
      >
        <div>
          <strong>{{ contato.nome }}</strong><br />
          {{ contato.email }}<br />
          {{ contato.telefone }}
        </div>
        <div>
          <Button
            label="Editar"
            icon="pi pi-pencil"
            @click="editarContato(contato)"
            class="edit-button"
          />
          <Button
            label="Remover"
            icon="pi pi-times"
            @click="removeContato(contato.id)"
            class="remove-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Button from "primevue/button";

export default {
  components: {
    InputText,
    InputMask,
    Button,
  },
  setup() {
    const API_BASE = "http://localhost:5256/api/Contato";

    const Contato = ref([]);
    const novoContato = ref({ id: null, nome: "", email: "", telefone: "" });
    const BuscarContato = ref("");
    const editando = ref(false);

    const getContatos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/ListarContatos`);
        Contato.value = response.data.dados || [];
      } catch (error) {
        console.error(
          "Erro ao buscar contatos:",
          error.response?.data?.mensagem || error.message
        );
      }
    };

    const saveContato = async () => {
      if (
        !novoContato.value.nome.trim() ||
        !novoContato.value.email.trim() ||
        !novoContato.value.telefone.trim()
      ) {
        alert("Preencha todos os campos!");
        return;
      }

      try {
        if (editando.value) {
          await axios.put(`${API_BASE}/EditarContato`, {
            id: novoContato.value.id,
            nome: novoContato.value.nome,
            email: novoContato.value.email,
            telefone: novoContato.value.telefone,
          });
        } else {
          await axios.post(`${API_BASE}/CriarContato`, {
            nome: novoContato.value.nome,
            email: novoContato.value.email,
            telefone: novoContato.value.telefone,
          });
        }

        novoContato.value = { id: null, nome: "", email: "", telefone: "" };
        editando.value = false;
        await getContatos();
      } catch (error) {
        console.error(
          "Erro ao salvar contato:",
          error.response?.data?.mensagem || error.message
        );
      }
    };

    const editarContato = (contato) => {
      novoContato.value = { ...contato };
      editando.value = true;
    };

    const cancelarEdicao = () => {
      novoContato.value = { id: null, nome: "", email: "", telefone: "" };
      editando.value = false;
    };

    const removeContato = async (id) => {
      try {
        await axios.delete(`${API_BASE}/ExcluirContato/${id}`);
        Contato.value = Contato.value.filter((c) => c.id !== id);
      } catch (error) {
        console.error(
          "Erro ao remover contato:",
          error.response?.data?.mensagem || error.message
        );
      }
    };

    const FiltrarContato = computed(() => {
      return Contato.value.filter((contato) =>
        contato.nome.toLowerCase().includes(BuscarContato.value.toLowerCase()) ||
        contato.email.toLowerCase().includes(BuscarContato.value.toLowerCase()) ||
        contato.telefone.includes(BuscarContato.value)
      );
    });

    onMounted(getContatos);

    return {
      Contato,
      novoContato,
      BuscarContato,
      editando,
      saveContato,
      editarContato,
      cancelarEdicao,
      removeContato,
      FiltrarContato,
    };
  },
};
</script>

<style scoped>
.container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #9e9b9b;
  border-radius: 8px;
}
.input-field {
  width: 100%;
  margin-bottom: 10px;
}
.button {
  width: 100%;
}
.cancel-button {
  background-color: #ccc;
  color: #333;
}
.Contato-list {
  margin-top: 20px;
}
.Contato-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.edit-button {
  background-color: #ffc107;
  color: white;
}
.remove-button {
  background-color: #dc3545;
  color: white;
}
</style>
