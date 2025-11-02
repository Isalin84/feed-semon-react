/**
 * Ожидание загрузки всех изображений в элементе
 */
const waitForImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = () => resolve(undefined);
      img.onerror = () => resolve(undefined);
    });
  });
  await Promise.all(imagePromises);
};

/**
 * Экспорт компонента в изображение для шаринга
 */
export const exportToImage = async (elementId: string, filename: string = 'victory.png') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      alert('Элемент не найден. Попробуйте ещё раз.');
      return;
    }

    console.log('Exporting element:', element);

    // Временно делаем элемент видимым для рендера
    const originalStyle = {
      opacity: element.style.opacity,
      zIndex: element.style.zIndex,
    };
    
    element.style.opacity = '1';
    element.style.zIndex = '9999';

    // Ждём загрузки всех изображений
    await waitForImages(element);
    
    // Дополнительная задержка для уверенности
    await new Promise(resolve => setTimeout(resolve, 300));

    // Используем html2canvas для экспорта DOM в canvas
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#FFFEF5', // Тёплый белый фон
      scale: 2, // Высокое качество
      logging: true, // Включаем логи для отладки
      useCORS: true,
      allowTaint: false,
      width: 600,
      windowWidth: 600,
    });

    // Возвращаем стили обратно
    element.style.opacity = originalStyle.opacity;
    element.style.zIndex = originalStyle.zIndex;

    console.log('Canvas created:', canvas.width, 'x', canvas.height);

    // Конвертируем canvas в blob
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Не удалось создать изображение. Попробуйте ещё раз.');
        return;
      }

      console.log('Blob created, size:', blob.size);

      // Создаём ссылку для скачивания
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Очищаем URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log('Download started!');
    }, 'image/png');

  } catch (error) {
    console.error('Failed to export image:', error);
    alert('Ошибка при сохранении изображения:\n' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
  }
};

/**
 * Копирование изображения в буфер обмена
 */
export const copyToClipboard = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      alert('Элемент не найден. Попробуйте ещё раз.');
      return;
    }

    console.log('Copying element:', element);

    // Временно делаем элемент видимым
    const originalStyle = {
      opacity: element.style.opacity,
      zIndex: element.style.zIndex,
    };
    
    element.style.opacity = '1';
    element.style.zIndex = '9999';

    // Ждём загрузки всех изображений
    await waitForImages(element);
    
    // Дополнительная задержка
    await new Promise(resolve => setTimeout(resolve, 300));

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      backgroundColor: '#FFFEF5',
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: false,
      width: 600,
      windowWidth: 600,
    });

    // Возвращаем стили
    element.style.opacity = originalStyle.opacity;
    element.style.zIndex = originalStyle.zIndex;

    console.log('Canvas created for clipboard:', canvas.width, 'x', canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Не удалось создать изображение.');
        return;
      }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        alert('🎉 Скриншот скопирован в буфер обмена!\n\nТеперь можешь вставить его где угодно (Ctrl+V)');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        alert('⚠️ Clipboard API не поддерживается.\nИспользуйте кнопку "Скачать".');
      }
    }, 'image/png');

  } catch (error) {
    console.error('Failed to copy image:', error);
    alert('Ошибка при копировании:\n' + (error instanceof Error ? error.message : 'Попробуйте кнопку "Скачать".'));
  }
};

