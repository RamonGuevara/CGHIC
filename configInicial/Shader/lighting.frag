#version 330 core

struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform Material material;

// Primera fuente de luz
uniform Light light;

// Segunda fuente de luz: gato
uniform Light gatoLight;

// Calcula la contribución de una fuente de luz
vec3 calcularLuz(Light fuente, vec3 norm, vec3 viewDir)
{
    // Ambiental
    vec3 ambient = fuente.ambient * material.ambient;

    // Difusa
    vec3 lightDir = normalize(fuente.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = fuente.diffuse * diff * material.diffuse;

    // Especular
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(
        max(dot(viewDir, reflectDir), 0.0),
        max(material.shininess, 1.0)
    );

    vec3 specular = fuente.specular * spec * material.specular;

    return ambient + diffuse + specular;
}

void main()
{
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);

    // Contribución de ambas luces
    vec3 luzPrincipal = calcularLuz(light, norm, viewDir);
    vec3 luzGato = calcularLuz(gatoLight, norm, viewDir);

    vec3 result = luzPrincipal + luzGato;

    color = vec4(result, 1.0);
}