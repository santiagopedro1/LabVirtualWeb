<svelte:head>
    <title>Início - Labvirtual</title>
</svelte:head>

<article class="prose dark:prose-invert lg:prose-xl">
    <h1>LabVirtual</h1>
    <h2>Introdução</h2>
    <p>
        Este projeto visa utilizar tecnologias de informação para monitorar
        variáveis ambientais relacionadas ao solo em atividades agrícolas, como
        a cultura do milho, através de sensores que coletam dados sobre o
        ambiente, proporcionando uma produção mais segura, eficiente e
        sustentável.
    </p>
    <p>
        A adoção de práticas de gestão de recursos hídricos é fundamental para
        garantir o melhor aproveitamento de água na cultura, minimizando
        desperdícios e aumentando a produtividade. A análise de diversas
        variáveis como temperatura, precipitação, irrigação, evapotranspiração,
        escoamento superficial, drenagem profunda e água armazenada no solo é
        essencial para o uso racional da água e para a qualidade dos recursos
        hídricos necessários para a vida e para todos os setores da cadeia
        produtiva. O monitoramento ambiental é um processo contínuo e
        sistemático de coleta de dados para avaliar as condições dos recursos
        naturais e identificar tendências ao longo do tempo.
    </p>
    <p>
        O projeto pretende tornar essas tecnologias mais acessíveis para
        agricultores de pequeno e médio porte.
    </p>
    <h2>Metodologia</h2>
    <p>
        O presente estudo foi realizado na área demonstrativa do Laboratório de
        Matemática e Biologia Computacional (LMBC) em conjunto o Grupo
        Interdisciplinar de Desenvolvimento Ambiental (GIDANE), na Universidade
        Federal do Pampa (UNIPAMPA), no campus de São Gabriel - RS, juntamente
        com o apoio e parceria do Grupo de Robótica e Automação Inteligente que
        trabalham no Laboratório e Grupo de Sistemas Digitais e Embarcados, do
        Centro de Ciências Computacionais da Universidade Federal do Rio Grande
        (FURG).
    </p>
    <p>
        Para o estudo foi realizado o plantio de milho manualmente, utilizando 3
        sementes por covas no período de novembro de 2021, em uma faixa de 8,5m
        x 3,5m, onde foram adotados dois tratamentos, com palha e sem palha
        (cobrindo o solo), separado por linhas com 6 covas em cada tratamento,
        totalizando 108 covas, porém apenas 56 pés de milhos se desenvolveram
        (figura 1). Com o intuito de avaliar a temperatura e umidade foram
        realizados acompanhamentos a partir da coleta de dados com caráter de
        variação e amplitude, ou seja, não apresentam calibração, para que
        expressem a sua real situação mas de forma relativa, até final de
        fevereiro de 2022.
    </p>
    <figure>
        <img
            src="/figura1.png"
            alt="Ilustra uma visão geral do funcionamento do sistema proposto acima"
        />
        <figcaption>
            Figura 1: Ilustra uma visão geral do funcionamento do sistema
            proposto.
        </figcaption>
    </figure>
    <p>
        Instalou-se sensores em uma das parcelas dos tratamentos, conectados a
        uma plataforma Arduino, um sistema de prototipagem eletrônica de
        Hardware livre e de placa única, onde foram realizadas coletas diárias.
    </p>
    <p>
        As leituras registradas pelos sensores foram realizadas de hora em hora
        sem interrupções, e enviados para a nuvem, salvo em exceções de falta de
        energia no local, porém o sistema registrava e posteriormente os dados
        eram importados manualmente para a nuvem.
    </p>
    <p>
        Em suma, foi instalado um sistema de irrigação por gotejamento e
        automatizado, possibilitando que o solo seja adequadamente umedecido,
        utilizou-se um solenóide controlado por timers. Com a automação por meio
        dos sensores, são capazes de acionar ou desligar os sistemas de
        irrigação a partir dos dados enviados continuamente aos sensores de
        umidade do solo (Leão, et. al, 2007) nos períodos da 00:00 às 00:10;
        8:00 às 8:15; 17:00 às 17:10; 17:20 às 17:30; 19:00 às 19:15. A
        utilização dessa tecnologia permite que ocorra um melhor aproveitamento
        hídrico, evitando desperdício e trazendo mais vantagens econômicas.
    </p>
</article>
