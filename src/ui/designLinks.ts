/**
 * Centralized design system links for Storybook
 */

// Types based on @storybook/addon-designs
type DesignTool = 'figma' | 'sketch' | 'iframe' | 'figspec' | 'experimental-figspec' | 'image' | 'link';

interface DesignConfig {
  type: DesignTool;
  url: string;
  allowFullscreen?: boolean;
  name?: string;
  offscreen?: boolean;
}

export const DESIGN_LINKS = {
  // Buttons
  ButtonAdd: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4437-2330',
  },
  ButtonPrimary: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4121-13157',
  },
  ButtonMinimal: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4121-13563',
  },
  ButtonOutline: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4436-7155',
  },
  ButtonLink: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4469-22797',
  },
  ButtonSplit: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4121-13945',
  },

  // Inputs
  InputText: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=3852-15267',
  },
  InputTextarea: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7100-16614',
  },
  InputColor: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7100-16266',
  },
  InputDate: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=6888-6550',
  },
  InputNumber: {
    figma: '',
  },
  InputPassword: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=3849-8794',
  },
  InputSearch: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=3849-8794',
  },
  InputSelect: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7100-4409',
  },
  FieldCheck: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=4361-3999',
  },
  FieldRange: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7558-27118',
  },
  FieldToggle: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7558-27133',
  },

  // Components
  Calendar: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=6888-6550',
  },
  Dropdown: {
    figma: '',
  },
  List: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7462-11865',
  },
  Menu: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=1839-12508',
  },
  ModalPanel: {
    figma: '',
  },
  ModalWindow: {
    figma: '',
  },
  ModalFullscreen: {
    figma: '',
  },
  Notification: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=2763-17842',
  },
  NotificationSmall: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=2763-17842',
  },
  Popover: {
    figma: '',
  },
  Select: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7100-4409',
  },
  SelectMultiple: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=7100-4409',
  },
  Tooltip: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=9133-26131',
  },
  WarningDialog: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=2212-13225',
  },
  ActionsDialog: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=2109-12581',
  },
  MiniDialog: {
    figma: '',
  },
  Badge: {
    figma: 'https://www.figma.com/design/X9o3ueR8dt2fsp96eUSn4R/Components?node-id=9199-15438',
  },

  // Atoms
  ColorsPalette: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=3724-19649',
  },
  ColorsText: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=3516-4325',
  },
  ColorsBackground: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=3898-35834',
  },
  ColorsIcon: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=3892-35613',
  },
  ColorsBorder: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=3896-35730',
  },
  Icons: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=2465-782',
  },
  Typography: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=30-3',
  },
  Shadows: {
    figma: 'https://www.figma.com/design/SvImSJtWiaK0m6BSC4WEBn/Atoms?node-id=81-0',
  },
} as const;

/**
 * Generic helper function to get design system link for a component
 *
 * @param componentName - The name of the component
 * @param designTool - The design tool to get the link for (default: 'figma')
 * @returns Storybook design parameters object or undefined
 */
export function getDesignLink(componentName: keyof typeof DESIGN_LINKS, designTool: DesignTool = 'figma') {
  const componentLinks = DESIGN_LINKS[componentName];
  const url = (componentLinks as Record<string, string>)[designTool];

  if (!url) {
    return undefined;
  }

  const config: DesignConfig = {
    type: designTool,
    url,
    allowFullscreen: true,
  };

  return {
    design: config,
  };
}
