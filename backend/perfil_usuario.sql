CREATE DATABASE IF NOT EXISTS perfil_usuario;
USE perfil_usuario;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imagem_perfil VARCHAR(255),
  nome VARCHAR(100) NOT NULL,
  idade INT,
  rua VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  biografia TEXT,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE usuarios 
ADD COLUMN cidade VARCHAR(255) AFTER bairro;

INSERT INTO usuarios (
    nome, 
    idade, 
    rua, 
    bairro, 
    cidade, 
    estado, 
    biografia
) VALUES (
    'Douglas Amorim', 
    30, 
    'Rua João José de Santana', 
    'Campaquara(Ribeirão)', 
    'Ilhabela', 
    'SP', 
    'Sou um Analista de Sistemas com sólida experiência em desenvolvimento 
    e manutenção de sistemas, especialmente em C# e ASP.NET. Atuando no setor desde 
    2016, já colaborou com empresas públicas e privadas, desenvolvendo funcionalidades, 
    relatórios e soluções voltadas à eficiência dos processos internos. 
    Graduado em Ciência da Computação e cursando Análise e Desenvolvimento de Sistemas, 
    alio domínio técnico a metodologias ágeis como Kanban e práticas modernas de 
    versionamento com Git e GitHub. Apaixonado por tecnologia, 
    também possui experiência com bancos de dados (SQL Server, Oracle, MySQL) e 
    ferramentas como Visual Studio e Jira.'
);

DROP TABLE usuarios;