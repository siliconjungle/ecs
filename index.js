class Store {
  entities = {}
  components = {}

  constructor (types) {
    for (const type of types) {
      components[type] = {}
    }
  }

  setComponent(type, id, component) {
    if (this.components[type] === undefined) {
      throw new Error(`Type ${type} does not exist`)
    }

    this.entities[id] ??= {}
    this.entities[id][type] = true

    this.components[type][id] = component
  }

  removeComponent(type, id) {
    if (this.components[type] === undefined) {
      throw new Error(`Type ${type} does not exist`)
    }

    if (this.components[type][id] === undefined) {
      throw new Error(`Component ${type} does not exist for id ${id}`)
    }

    delete this.components[type][id]
    delete this.entities[id][type]
    if (Object.keys(this.entities[id]).length === 0) {
      delete this.entities[id]
    }
  }

  getComponent(type, id) {
    if (this.components[type] === undefined) {
      throw new Error(`Type ${type} does not exist`)
    }

    if (this.components[type][id] === undefined) {
      throw new Error(`Component ${type} does not exist for id ${id}`)
    }

    return this.components[type][id]
  }

  getComponentsByType(type) {
    if (this.components[type] === undefined) {
      throw new Error(`Type ${type} does not exist`)
    }

    return this.components[type]
  }

  getComponentsWithTypes(types) {
    const components = {}

    for (const type in types) {
      if (this.components[type] === undefined) {
        throw new Error(`Type ${type} does not exist`)
      } else {
        components[type] = this.components[type]
      }
    }

    const ids = []
    for (const type in types) {
      ids.push(...Object.keys(this.components[type]))
    }

    const uniqueIds = Array.from(new Set(ids))

    for (const id of uniqueIds) {
      let hasAllComponents = true
      for (const type in types) {
        if (this.entities[id][type] === undefined) {
          hasAllComponents = false
          continue
        }
      }

      if (hasAllComponents) {
        for (const type in types) {
          components[type][id] = this.components[type][id]
        }
      }
    }

    return components
  }

  getEntityComponents(id) {
    if (this.entities[id] === undefined) {
      throw new Error(`Entity ${id} does not exist`)
    }

    const components = {}

    for (const type in this.entities[id]) {
      components[type] = this.getComponent(type, id)
    }

    return components
  }

  getEntitiesWithType(type) {
    if (this.components[type] === undefined) {
      throw new Error(`Type ${type} does not exist`)
    }

    const entities = {}

    for (const id in this.components[type]) {
      entities[id] = this.getEntityComponents(id)
    }

    return entities
  }
}

export default Store
