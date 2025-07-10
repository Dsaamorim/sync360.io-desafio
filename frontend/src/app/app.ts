import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Estado {
  sigla: string;
  nome: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);
  
  submitted = false;
  estadosBrasileiros: Estado[] = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  apenasLetrasEspacos(event: KeyboardEvent) {
    const regex = /^[A-Za-zÀ-ú\s]$/;
    const tecla = event.key;
    if (!regex.test(tecla)) {
      event.preventDefault();
    }
  }

  usuario = {
    id: 1,
    nome: 'Carregando...',
    idade: null as number | null,
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    biografia: '',
    imagem_perfil: './assets/DouglasAmorim.png'
  };

  editando = false;
  carregando = true;
  erro = '';
  sucesso = false;
  formValid = false;
  checkingForm = false;

  ngOnInit() {
    this.carregarUsuario();
  }

  apenasLetras(event: KeyboardEvent) {
    const regex = /^[A-Za-zÀ-ú\s]$/;
    const tecla = event.key;
    if (!regex.test(tecla)) {
      event.preventDefault();        
    }
  }

  carregarUsuario() {
    this.http.get('http://localhost:3000/api/usuario').subscribe({
      next: (data: any) => {
        if (data) {
          this.usuario = {
            id: data.id || 1,
            nome: data.nome || 'Nome não informado',
            idade: data.idade || null,
            rua: data.rua || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || '',
            biografia: data.biografia || 'Nenhuma biografia cadastrada',
            imagem_perfil: data.imagem_perfil || './assets/DouglasAmorim.png'
          };
        }
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
        this.erro = 'Erro ao carregar dados do usuário';
        this.usuario.nome = 'Erro ao carregar dados';
        this.carregando = false;
      }
    });
  }

  getDefaultImage(): string {
    return '/assets/default-profile.png';
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.getDefaultImage();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.usuario.imagem_perfil = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async salvarUsuario(form: NgForm) {
    this.submitted = true;
    this.checkingForm = true;

    await new Promise(resolve => setTimeout(resolve, 0));

    if (form.invalid) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios corretamente';
      this.checkingForm = false;
      return;
    }

    this.formValid = true;
    this.erro = '';
    this.sucesso = false;

    const payload = {
      ...this.usuario,
      imagem_perfil: this.usuario.imagem_perfil.startsWith('data:') ? '' : this.usuario.imagem_perfil
    };

    this.http.put('http://localhost:3000/api/usuario', payload).subscribe({
      next: () => {
        this.sucesso = true;
        this.editando = false;
        setTimeout(() => this.sucesso = false, 3000);
        this.carregarUsuario();
      },
      error: (err) => {
        console.error('Erro ao salvar usuário:', err);
        this.erro = 'Erro ao salvar dados do usuário';
      },
      complete: () => {
        this.checkingForm = false;
        this.formValid = false;
      }
    });
  }
}