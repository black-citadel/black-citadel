export const podTemplate = (name: string, namespace: string, image: string) => ({
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: {
    name,
    namespace
  },
  spec: {
    containers: [{
      name,
      image
    }]
  }
});