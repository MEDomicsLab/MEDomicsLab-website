import researchProjects from "../data/research-projects.json";

const useGet = () => {
  return { data: researchProjects, isLoading: false };
};

export default { useGet };
