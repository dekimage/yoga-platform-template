export const themes = {
  zenYoga: {
    logo: "/assets/zen-logo.svg",
    primaryColor: "#EFAF7C",
    accentColor: "#A66C4F",
    font: "Inter",
  },
  flexYoga: {
    logo: "/assets/flexy-logo.svg",
    primaryColor: "#8BC6EC",
    accentColor: "#9599E2",
    font: "Poppins",
  },
}

export function getTheme(themeName = "zenYoga") {
  return themes[themeName] || themes.zenYoga
}
