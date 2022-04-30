interface interactionStep<T> {
  label: string;
  action: () => Promise<T>;
  applicable: () => Promise<boolean>;
}

export class EthInteraction {
  private interactions: interactionStep<any>[];

  constructor(interactions: interactionStep<any>[]) {
    this.interactions = interactions;
  }

  next: () => Promise<
    { label: string; action: () => Promise<any> } | undefined
  > = async () => {
    for (const interaction of this.interactions) {
      if (await interaction.applicable()) {
        console.log(interaction.label + ":applicable");
        return { label: interaction.label, action: interaction.action };
      }
    }
    return undefined;
  };
}
